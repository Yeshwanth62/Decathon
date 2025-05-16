from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pymongo import MongoClient
from bson import ObjectId

from models.user import UserRole, TokenData, UserResponse
from config import settings, COLLECTIONS

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/login")

# MongoDB connection
client = MongoClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DB_NAME]
users_collection = db[COLLECTIONS["users"]]

def verify_password(plain_password, hashed_password):
    """Verify password against hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password for storing"""
    return pwd_context.hash(password)

async def authenticate_user(email: str, password: str):
    """Authenticate a user by email and password"""
    user = users_collection.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=payload.get("role"))
    except JWTError:
        raise credentials_exception

    user = users_collection.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception

    # Convert ObjectId to string
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]  # Don't return password

    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """Get current active user"""
    if current_user.get("is_active") is False:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def check_user_role(allowed_roles: list[UserRole]):
    """Check if user has required role"""
    async def _check_user_role(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in [role.value for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
    return _check_user_role