from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import random
import string
from typing import List, Dict, Any, Optional

from models.user import (
    UserCreate, UserLogin, UserResponse, UserRole,
    PatientProfile, DoctorProfile, HospitalProfile, Token
)
from services.auth_service import (
    authenticate_user, create_access_token, get_current_user,
    get_current_active_user, check_user_role, get_password_hash
)
from integrations.twilio_integration import send_otp, verify_phone_number
from firebase.firebase_admin_config import verify_firebase_token
from config import settings, COLLECTIONS, LANGUAGES

# Create router
router = APIRouter()

# MongoDB connection
client = MongoClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DB_NAME]
users_collection = db[COLLECTIONS["users"]]
patients_collection = db[COLLECTIONS["patients"]]
doctors_collection = db[COLLECTIONS["doctors"]]
hospitals_collection = db[COLLECTIONS["hospitals"]]

# Helper functions
def generate_otp(length=6):
    """Generate a random OTP"""
    return ''.join(random.choices(string.digits, k=length))

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """Register a new user"""
    # Check if email already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if phone number is valid
    if not await verify_phone_number(user.phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid phone number"
        )

    # Hash password
    hashed_password = get_password_hash(user.password)

    # Create user
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict.update({
        "password": hashed_password,
        "is_active": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })

    # Insert user
    result = users_collection.insert_one(user_dict)

    # Create profile based on role
    user_id = str(result.inserted_id)

    if user.role == UserRole.PATIENT:
        # Create patient profile
        patient_profile = {
            "user_id": user_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        patients_collection.insert_one(patient_profile)

    elif user.role == UserRole.DOCTOR:
        # Create doctor profile
        doctor_profile = {
            "user_id": user_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        doctors_collection.insert_one(doctor_profile)

    elif user.role == UserRole.HOSPITAL:
        # Create hospital profile
        hospital_profile = {
            "user_id": user_id,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        hospitals_collection.insert_one(hospital_profile)

    # Get created user
    created_user = users_collection.find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"])
    del created_user["_id"]
    del created_user["password"]  # Don't return password

    return created_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )

    # Convert ObjectId to string
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]  # Don't return password

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/firebase-login", response_model=Token)
async def firebase_login(id_token: str = Body(..., embed=True)):
    """Login with Firebase ID token"""
    # Verify Firebase ID token
    decoded_token = await verify_firebase_token(id_token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user by email
    email = decoded_token.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found in Firebase token"
        )

    user = users_collection.find_one({"email": email})

    # If user doesn't exist, create a new one
    if not user:
        # Create user with random password (not used for Firebase auth)
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
        hashed_password = get_password_hash(random_password)

        # Create user
        user_dict = {
            "email": email,
            "password": hashed_password,
            "name": decoded_token.get("name", ""),
            "phone": decoded_token.get("phone_number", ""),
            "role": UserRole.PATIENT.value,  # Default role
            "preferred_language": "en",  # Default language
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }

        # Insert user
        result = users_collection.insert_one(user_dict)

        # Create patient profile
        patient_profile = {
            "user_id": str(result.inserted_id),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        patients_collection.insert_one(patient_profile)

        # Get created user
        user = users_collection.find_one({"_id": result.inserted_id})

    # Create access token
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )

    # Convert ObjectId to string
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]  # Don't return password

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/send-otp")
async def send_verification_otp(phone: str = Body(..., embed=True)):
    """Send OTP to phone number"""
    # Generate OTP
    otp = generate_otp()

    # Store OTP in database (with expiration)
    users_collection.update_one(
        {"phone": phone},
        {"$set": {
            "otp": otp,
            "otp_expiry": datetime.now() + timedelta(minutes=10)
        }},
        upsert=True
    )

    # Send OTP
    success = await send_otp(phone, otp)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(phone: str = Body(...), otp: str = Body(...)):
    """Verify OTP"""
    # Get user by phone
    user = users_collection.find_one({
        "phone": phone,
        "otp": otp,
        "otp_expiry": {"$gt": datetime.now()}
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    # Clear OTP
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$unset": {"otp": "", "otp_expiry": ""}}
    )

    return {"message": "OTP verified successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.get("/languages")
async def get_supported_languages():
    """Get supported languages"""
    return LANGUAGES

@router.put("/language")
async def update_language_preference(
    language: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_active_user)
):
    """Update language preference"""
    if language not in LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language. Supported languages: {', '.join(LANGUAGES.keys())}"
        )

    # Update language preference
    users_collection.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": {
            "preferred_language": language,
            "updated_at": datetime.now()
        }}
    )

    return {"message": f"Language preference updated to {LANGUAGES[language]}"}

@router.get("/profile/patient", response_model=PatientProfile)
async def get_patient_profile(current_user: dict = Depends(check_user_role([UserRole.PATIENT]))):
    """Get patient profile"""
    profile = patients_collection.find_one({"user_id": current_user["id"]})

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found"
        )

    return profile

@router.put("/profile/patient", response_model=PatientProfile)
async def update_patient_profile(
    profile_update: PatientProfile,
    current_user: dict = Depends(check_user_role([UserRole.PATIENT]))
):
    """Update patient profile"""
    # Update profile
    profile_dict = profile_update.dict(exclude={"user_id"})
    profile_dict["updated_at"] = datetime.now()

    patients_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_dict}
    )

    # Get updated profile
    updated_profile = patients_collection.find_one({"user_id": current_user["id"]})

    return updated_profile

@router.get("/profile/doctor", response_model=DoctorProfile)
async def get_doctor_profile(current_user: dict = Depends(check_user_role([UserRole.DOCTOR]))):
    """Get doctor profile"""
    profile = doctors_collection.find_one({"user_id": current_user["id"]})

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found"
        )

    return profile

@router.put("/profile/doctor", response_model=DoctorProfile)
async def update_doctor_profile(
    profile_update: DoctorProfile,
    current_user: dict = Depends(check_user_role([UserRole.DOCTOR]))
):
    """Update doctor profile"""
    # Update profile
    profile_dict = profile_update.dict(exclude={"user_id"})
    profile_dict["updated_at"] = datetime.now()

    doctors_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_dict}
    )

    # Get updated profile
    updated_profile = doctors_collection.find_one({"user_id": current_user["id"]})

    return updated_profile

@router.get("/profile/hospital", response_model=HospitalProfile)
async def get_hospital_profile(current_user: dict = Depends(check_user_role([UserRole.HOSPITAL]))):
    """Get hospital profile"""
    profile = hospitals_collection.find_one({"user_id": current_user["id"]})

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hospital profile not found"
        )

    return profile

@router.put("/profile/hospital", response_model=HospitalProfile)
async def update_hospital_profile(
    profile_update: HospitalProfile,
    current_user: dict = Depends(check_user_role([UserRole.HOSPITAL]))
):
    """Update hospital profile"""
    # Update profile
    profile_dict = profile_update.dict(exclude={"user_id"})
    profile_dict["updated_at"] = datetime.now()

    hospitals_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_dict}
    )

    # Get updated profile
    updated_profile = hospitals_collection.find_one({"user_id": current_user["id"]})

    return updated_profile