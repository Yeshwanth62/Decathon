"""
Notification models for Sanjeevani 2.0
"""

from enum import Enum
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

from app.models.common import PyObjectId


class NotificationType(str, Enum):
    """Types of notifications"""
    APPOINTMENT = "appointment"
    REMINDER = "reminder"
    MESSAGE = "message"
    EMERGENCY = "emergency"
    SYSTEM = "system"


class Notification(BaseModel):
    """Notification model"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    message: str
    type: NotificationType
    user_id: Optional[str] = None  # If None, it's a broadcast notification
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    data: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }


class NotificationCreate(BaseModel):
    """Model for creating a notification"""
    title: str
    message: str
    type: NotificationType
    user_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class NotificationUpdate(BaseModel):
    """Model for updating a notification"""
    read: Optional[bool] = None


class NotificationInDB(Notification):
    """Notification model as stored in the database"""
    pass


class NotificationResponse(BaseModel):
    """Response model for notifications"""
    id: str
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime
    data: Optional[Dict[str, Any]] = None

    class Config:
        schema_extra = {
            "example": {
                "id": "60d21b4967d0d8992e610c85",
                "title": "Appointment Reminder",
                "message": "You have an appointment with Dr. Smith tomorrow at 10:00 AM",
                "type": "appointment",
                "read": False,
                "created_at": "2023-06-01T10:00:00",
                "data": {
                    "appointment_id": "60d21b4967d0d8992e610c85",
                    "doctor_name": "Dr. Smith",
                    "time": "2023-06-02T10:00:00"
                }
            }
        }
