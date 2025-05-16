from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    RESCHEDULED = "rescheduled"

class AppointmentType(str, Enum):
    IN_PERSON = "in_person"
    TELEMEDICINE = "telemedicine"
    EMERGENCY = "emergency"

class AppointmentBase(BaseModel):
    patient_id: str
    doctor_id: str
    hospital_id: Optional[str] = None
    appointment_type: AppointmentType
    appointment_date: datetime
    reason: str
    symptoms: Optional[List[str]] = []
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: str
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class EmergencyRequestBase(BaseModel):
    patient_id: str
    location: Dict[str, float]  # latitude, longitude
    address: Optional[Dict[str, str]] = None
    symptoms: Optional[List[str]] = []
    notes: Optional[str] = None

class EmergencyRequestCreate(EmergencyRequestBase):
    pass

class EmergencyRequestStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DISPATCHED = "dispatched"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class EmergencyRequestResponse(EmergencyRequestBase):
    id: str
    status: EmergencyRequestStatus
    ambulance_id: Optional[str] = None
    hospital_id: Optional[str] = None
    estimated_arrival_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True