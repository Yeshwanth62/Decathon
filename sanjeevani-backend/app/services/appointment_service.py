from datetime import datetime
from typing import List, Optional, Dict, Any
from pymongo import MongoClient
from bson import ObjectId
from fastapi import HTTPException, status

from models.appointment import AppointmentCreate, AppointmentUpdate, AppointmentStatus
from config import settings, COLLECTIONS

# MongoDB connection
client = MongoClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DB_NAME]
appointments_collection = db[COLLECTIONS["appointments"]]
users_collection = db[COLLECTIONS["users"]]
patients_collection = db[COLLECTIONS["patients"]]
doctors_collection = db[COLLECTIONS["doctors"]]
hospitals_collection = db[COLLECTIONS["hospitals"]]

async def create_appointment(appointment: AppointmentCreate, user_id: str) -> Dict[str, Any]:
    """Create a new appointment"""
    # Check if patient exists
    patient = patients_collection.find_one({"user_id": appointment.patient_id})
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    # Check if doctor exists
    doctor = doctors_collection.find_one({"user_id": appointment.doctor_id})
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    # Check if hospital exists if hospital_id is provided
    if appointment.hospital_id:
        hospital = hospitals_collection.find_one({"user_id": appointment.hospital_id})
        if not hospital:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Hospital not found"
            )

    # Create appointment
    appointment_dict = appointment.dict()
    appointment_dict.update({
        "status": AppointmentStatus.PENDING.value,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "created_by": user_id
    })

    result = appointments_collection.insert_one(appointment_dict)

    # Get the created appointment
    created_appointment = appointments_collection.find_one({"_id": result.inserted_id})
    created_appointment["id"] = str(created_appointment["_id"])
    del created_appointment["_id"]

    return created_appointment

async def get_appointment(appointment_id: str) -> Dict[str, Any]:
    """Get appointment by ID"""
    try:
        appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    appointment["id"] = str(appointment["_id"])
    del appointment["_id"]

    return appointment

async def get_appointments_by_patient(patient_id: str) -> List[Dict[str, Any]]:
    """Get all appointments for a patient"""
    appointments = list(appointments_collection.find({"patient_id": patient_id}))

    # Convert ObjectId to string
    for appointment in appointments:
        appointment["id"] = str(appointment["_id"])
        del appointment["_id"]

    return appointments

async def get_appointments_by_doctor(doctor_id: str) -> List[Dict[str, Any]]:
    """Get all appointments for a doctor"""
    appointments = list(appointments_collection.find({"doctor_id": doctor_id}))

    # Convert ObjectId to string
    for appointment in appointments:
        appointment["id"] = str(appointment["_id"])
        del appointment["_id"]

    return appointments

async def update_appointment(appointment_id: str, appointment_update: AppointmentUpdate) -> Dict[str, Any]:
    """Update an appointment"""
    try:
        appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Update appointment
    update_data = appointment_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now()

    appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": update_data}
    )

    # Get updated appointment
    updated_appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    updated_appointment["id"] = str(updated_appointment["_id"])
    del updated_appointment["_id"]

    return updated_appointment

async def cancel_appointment(appointment_id: str) -> Dict[str, Any]:
    """Cancel an appointment"""
    try:
        appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Cancel appointment
    appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {
            "status": AppointmentStatus.CANCELLED.value,
            "updated_at": datetime.now()
        }}
    )

    # Get updated appointment
    updated_appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    updated_appointment["id"] = str(updated_appointment["_id"])
    del updated_appointment["_id"]

    return updated_appointment