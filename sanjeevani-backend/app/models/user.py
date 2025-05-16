from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    HOSPITAL = "hospital"
    ADMIN = "admin"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    name: str
    preferred_language: str = "en"

class UserCreate(UserBase):
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PatientProfile(BaseModel):
    user_id: str
    age: Optional[int] = None
    gender: Optional[Gender] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = []
    medical_conditions: Optional[List[str]] = []
    emergency_contact: Optional[Dict[str, str]] = None
    insurance_info: Optional[Dict[str, Any]] = None
    address: Optional[Dict[str, str]] = None

    class Config:
        orm_mode = True

class DoctorProfile(BaseModel):
    user_id: str
    specialization: str
    qualifications: List[str]
    experience_years: int
    hospital_id: Optional[str] = None
    available_days: List[str] = []
    available_hours: Dict[str, List[str]] = {}
    consultation_fee: float

    class Config:
        orm_mode = True

class HospitalProfile(BaseModel):
    user_id: str
    address: Dict[str, str]
    contact_details: Dict[str, str]
    facilities: List[str] = []
    departments: List[str] = []
    emergency_services: bool = False
    ambulance_services: bool = False

    class Config:
        orm_mode = True

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse