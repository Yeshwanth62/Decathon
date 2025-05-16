"""
Notification service for Sanjeevani 2.0
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.mongodb import get_database
from app.models.notification import (
    Notification,
    NotificationCreate,
    NotificationUpdate,
    NotificationInDB,
    NotificationType
)
from app.models.common import PaginatedResponse

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for handling notifications"""

    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_database)):
        self.db = db
        self.collection = db.notifications

    async def create_notification(self, notification: Notification) -> NotificationInDB:
        """Create a new notification"""
        notification_dict = notification.dict(by_alias=True)
        result = await self.collection.insert_one(notification_dict)
        notification_dict["_id"] = result.inserted_id
        return NotificationInDB(**notification_dict)

    async def get_notification(self, notification_id: str) -> Optional[NotificationInDB]:
        """Get a notification by ID"""
        notification = await self.collection.find_one({"_id": notification_id})
        if notification:
            return NotificationInDB(**notification)
        return None

    async def get_user_notifications(
        self, user_id: str, page: int = 1, limit: int = 20, unread_only: bool = False
    ) -> PaginatedResponse:
        """Get notifications for a user with pagination"""
        skip = (page - 1) * limit
        query = {"user_id": user_id}
        
        if unread_only:
            query["read"] = False
            
        # Get total count
        total = await self.collection.count_documents(query)
        
        # Get notifications with pagination
        cursor = self.collection.find(query)
        cursor.sort("created_at", -1)  # Sort by created_at descending
        cursor.skip(skip).limit(limit)
        
        notifications = []
        async for doc in cursor:
            notifications.append(NotificationInDB(**doc))
            
        # Calculate total pages
        pages = (total + limit - 1) // limit
        
        return PaginatedResponse(
            total=total,
            page=page,
            limit=limit,
            pages=pages,
            items=notifications
        )

    async def mark_as_read(self, notification_id: str) -> bool:
        """Mark a notification as read"""
        result = await self.collection.update_one(
            {"_id": notification_id},
            {"$set": {"read": True}}
        )
        return result.modified_count > 0

    async def mark_all_as_read(self, user_id: str) -> int:
        """Mark all notifications for a user as read"""
        result = await self.collection.update_many(
            {"user_id": user_id, "read": False},
            {"$set": {"read": True}}
        )
        return result.modified_count

    async def delete_notification(self, notification_id: str) -> bool:
        """Delete a notification"""
        result = await self.collection.delete_one({"_id": notification_id})
        return result.deleted_count > 0

    async def create_appointment_notification(
        self, user_id: str, title: str, message: str, appointment_data: Dict[str, Any]
    ) -> NotificationInDB:
        """Create an appointment notification"""
        notification = Notification(
            title=title,
            message=message,
            type=NotificationType.APPOINTMENT,
            user_id=user_id,
            data=appointment_data
        )
        return await self.create_notification(notification)

    async def create_reminder_notification(
        self, user_id: str, title: str, message: str, reminder_data: Dict[str, Any]
    ) -> NotificationInDB:
        """Create a reminder notification"""
        notification = Notification(
            title=title,
            message=message,
            type=NotificationType.REMINDER,
            user_id=user_id,
            data=reminder_data
        )
        return await self.create_notification(notification)

    async def create_message_notification(
        self, user_id: str, title: str, message: str, message_data: Dict[str, Any]
    ) -> NotificationInDB:
        """Create a message notification"""
        notification = Notification(
            title=title,
            message=message,
            type=NotificationType.MESSAGE,
            user_id=user_id,
            data=message_data
        )
        return await self.create_notification(notification)

    async def create_emergency_notification(
        self, user_id: str, title: str, message: str, emergency_data: Dict[str, Any]
    ) -> NotificationInDB:
        """Create an emergency notification"""
        notification = Notification(
            title=title,
            message=message,
            type=NotificationType.EMERGENCY,
            user_id=user_id,
            data=emergency_data
        )
        return await self.create_notification(notification)

    async def create_system_notification(
        self, user_id: Optional[str], title: str, message: str, system_data: Optional[Dict[str, Any]] = None
    ) -> NotificationInDB:
        """Create a system notification"""
        notification = Notification(
            title=title,
            message=message,
            type=NotificationType.SYSTEM,
            user_id=user_id,
            data=system_data
        )
        return await self.create_notification(notification)

    async def get_unread_count(self, user_id: str) -> int:
        """Get count of unread notifications for a user"""
        return await self.collection.count_documents({"user_id": user_id, "read": False})
