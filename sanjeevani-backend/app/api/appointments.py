from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Body
from typing import List, Optional
from datetime import datetime, timedelta

from models.appointment import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse,
    AppointmentStatus, EmergencyRequestCreate, EmergencyRequestResponse
)
from models.user import UserRole
from services.auth_service import get_current_active_user, check_user_role
from services.appointment_service import (
    create_appointment, get_appointment, get_appointments_by_patient,
    get_appointments_by_doctor, update_appointment, cancel_appointment
)
from services.emergency_service import (
    create_emergency_request, get_emergency_request, update_emergency_status
)
from integrations.google_maps_integration import geocode_address, find_nearby_hospitals
from integrations.twilio_integration import send_appointment_reminder

# Create router
router = APIRouter()

@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def book_appointment(
    appointment: AppointmentCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Book a new appointment"""
    # Create appointment
    created_appointment = await create_appointment(appointment, current_user["id"])
    return created_appointment

@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment_by_id(
    appointment_id: str = Path(..., description="The ID of the appointment to get"),
    current_user: dict = Depends(get_current_active_user)
):
    """Get appointment by ID"""
    appointment = await get_appointment(appointment_id)

    # Check if user has permission to view this appointment
    if (current_user["role"] != UserRole.ADMIN.value and
        current_user["id"] != appointment["patient_id"] and
        current_user["id"] != appointment["doctor_id"] and
        current_user["id"] != appointment.get("hospital_id")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this appointment"
        )

    return appointment

@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    role: Optional[str] = Query(None, description="Filter by role (patient, doctor, hospital)"),
    status: Optional[AppointmentStatus] = Query(None, description="Filter by status"),
    from_date: Optional[datetime] = Query(None, description="Filter from date"),
    to_date: Optional[datetime] = Query(None, description="Filter to date"),
    current_user: dict = Depends(get_current_active_user)
):
    """Get appointments"""
    # Get appointments based on user role
    if current_user["role"] == UserRole.PATIENT.value:
        appointments = await get_appointments_by_patient(current_user["id"])
    elif current_user["role"] == UserRole.DOCTOR.value:
        appointments = await get_appointments_by_doctor(current_user["id"])
    elif current_user["role"] == UserRole.HOSPITAL.value:
        # Get all appointments for this hospital
        appointments = await get_appointments_by_hospital(current_user["id"])
    elif current_user["role"] == UserRole.ADMIN.value:
        # Admins can see all appointments
        appointments = await get_all_appointments()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view appointments"
        )

    # Apply filters
    if status:
        appointments = [a for a in appointments if a["status"] == status.value]

    if from_date:
        appointments = [a for a in appointments if a["appointment_date"] >= from_date]

    if to_date:
        appointments = [a for a in appointments if a["appointment_date"] <= to_date]

    return appointments

@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment_by_id(
    appointment_update: AppointmentUpdate,
    appointment_id: str = Path(..., description="The ID of the appointment to update"),
    current_user: dict = Depends(get_current_active_user)
):
    """Update appointment"""
    # Get appointment
    appointment = await get_appointment(appointment_id)

    # Check if user has permission to update this appointment
    if (current_user["role"] != UserRole.ADMIN.value and
        current_user["id"] != appointment["patient_id"] and
        current_user["id"] != appointment["doctor_id"] and
        current_user["id"] != appointment.get("hospital_id")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this appointment"
        )

    # Update appointment
    updated_appointment = await update_appointment(appointment_id, appointment_update)
    return updated_appointment

@router.delete("/{appointment_id}", response_model=AppointmentResponse)
async def cancel_appointment_by_id(
    appointment_id: str = Path(..., description="The ID of the appointment to cancel"),
    current_user: dict = Depends(get_current_active_user)
):
    """Cancel appointment"""
    # Get appointment
    appointment = await get_appointment(appointment_id)

    # Check if user has permission to cancel this appointment
    if (current_user["role"] != UserRole.ADMIN.value and
        current_user["id"] != appointment["patient_id"] and
        current_user["id"] != appointment["doctor_id"] and
        current_user["id"] != appointment.get("hospital_id")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to cancel this appointment"
        )

    # Cancel appointment
    cancelled_appointment = await cancel_appointment(appointment_id)
    return cancelled_appointment

@router.post("/reminder/{appointment_id}")
async def send_appointment_reminder_by_id(
    appointment_id: str = Path(..., description="The ID of the appointment to send reminder for"),
    current_user: dict = Depends(check_user_role([UserRole.DOCTOR, UserRole.HOSPITAL, UserRole.ADMIN]))
):
    """Send appointment reminder"""
    # Get appointment
    appointment = await get_appointment(appointment_id)

    # Get patient phone number
    from pymongo import MongoClient
    from config import settings, COLLECTIONS

    client = MongoClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    users_collection = db[COLLECTIONS["users"]]

    patient = users_collection.find_one({"_id": appointment["patient_id"]})
    if not patient or not patient.get("phone"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient phone number not found"
        )

    # Get doctor name
    doctor = users_collection.find_one({"_id": appointment["doctor_id"]})
    doctor_name = doctor.get("name", "your doctor") if doctor else "your doctor"

    # Get hospital name and location
    hospital_name = "the clinic"
    hospital_location = "the scheduled location"

    if appointment.get("hospital_id"):
        hospital = users_collection.find_one({"_id": appointment["hospital_id"]})
        if hospital:
            hospital_name = hospital.get("name", "the clinic")
            hospital_location = hospital.get("address", {}).get("formatted_address", "the scheduled location")

    # Format appointment details
    appointment_details = {
        "doctor_name": doctor_name,
        "date": appointment["appointment_date"].strftime("%A, %B %d, %Y"),
        "time": appointment["appointment_date"].strftime("%I:%M %p"),
        "location": f"{hospital_name} at {hospital_location}"
    }

    # Send reminder
    success = await send_appointment_reminder(patient["phone"], appointment_details)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send appointment reminder"
        )

    return {"message": "Appointment reminder sent successfully"}

@router.post("/emergency", response_model=EmergencyRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_emergency(
    emergency_request: EmergencyRequestCreate,
    current_user: dict = Depends(get_current_active_user)
):
    """Create emergency request"""
    # Create emergency request
    created_request = await create_emergency_request(emergency_request, current_user["id"])
    return created_request

@router.get("/emergency/{request_id}", response_model=EmergencyRequestResponse)
async def get_emergency_by_id(
    request_id: str = Path(..., description="The ID of the emergency request to get"),
    current_user: dict = Depends(get_current_active_user)
):
    """Get emergency request by ID"""
    emergency_request = await get_emergency_request(request_id)

    # Check if user has permission to view this emergency request
    if (current_user["role"] != UserRole.ADMIN.value and
        current_user["id"] != emergency_request["patient_id"] and
        current_user["id"] != emergency_request.get("hospital_id")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this emergency request"
        )

    return emergency_request

@router.post("/emergency/nearby-hospitals")
async def find_nearby_hospitals_by_address(
    address: str = Body(..., embed=True),
    radius: int = Body(5000, embed=True, description="Search radius in meters"),
    current_user: dict = Depends(get_current_active_user)
):
    """Find nearby hospitals by address"""
    # Geocode address
    location = await geocode_address(address)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to geocode address"
        )

    # Find nearby hospitals
    hospitals = await find_nearby_hospitals(location["latitude"], location["longitude"], radius)
    if not hospitals:
        return {"hospitals": []}

    return {"hospitals": hospitals}