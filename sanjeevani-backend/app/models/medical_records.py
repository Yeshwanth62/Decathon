from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class RecordType(str, Enum):
    PRESCRIPTION = "prescription"
    LAB_REPORT = "lab_report"
    IMAGING = "imaging"
    DISCHARGE_SUMMARY = "discharge_summary"
    CONSULTATION = "consultation"
    VACCINATION = "vaccination"
    OTHER = "other"

class MedicalRecordBase(BaseModel):
    patient_id: str
    record_type: RecordType
    title: str
    description: Optional[str] = None
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    appointment_id: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    file_data: Optional[Dict[str, Any]] = None

class MedicalRecordResponse(MedicalRecordBase):
    id: str
    file_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class PrescriptionBase(BaseModel):
    patient_id: str
    doctor_id: str
    appointment_id: Optional[str] = None
    diagnosis: str
    notes: Optional[str] = None

class PrescriptionCreate(PrescriptionBase):
    medications: List[Dict[str, Any]]

class PrescriptionResponse(PrescriptionBase):
    id: str
    medications: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class LabReportBase(BaseModel):
    patient_id: str
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    test_name: str
    test_date: datetime
    results: Dict[str, Any]

class LabReportCreate(LabReportBase):
    pass

class LabReportResponse(LabReportBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True