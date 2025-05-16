"""
Notification API endpoints for Sanjeevani 2.0
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status

from app.models.notification import (
    NotificationResponse,
    NotificationCreate,
    NotificationUpdate,
    NotificationType
)
from app.models.common import PaginatedResponse
from app.services.notification_service import NotificationService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=PaginatedResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Get notifications for the current user
    """
    return await notification_service.get_user_notifications(
        user_id=current_user.id,
        page=page,
        limit=limit,
        unread_only=unread_only
    )


@router.get("/unread-count", response_model=int)
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Get count of unread notifications for the current user
    """
    return await notification_service.get_unread_count(current_user.id)


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: str = Path(...),
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Get a specific notification
    """
    notification = await notification_service.get_notification(notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if notification belongs to the current user
    if notification.user_id and notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this notification"
        )
        
    return notification


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: str = Path(...),
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Mark a notification as read
    """
    notification = await notification_service.get_notification(notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if notification belongs to the current user
    if notification.user_id and notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this notification"
        )
    
    success = await notification_service.mark_as_read(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark notification as read"
        )
    
    # Get updated notification
    updated_notification = await notification_service.get_notification(notification_id)
    return updated_notification


@router.patch("/mark-all-read", response_model=int)
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Mark all notifications as read for the current user
    Returns the number of notifications marked as read
    """
    count = await notification_service.mark_all_as_read(current_user.id)
    return count


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: str = Path(...),
    current_user: User = Depends(get_current_user),
    notification_service: NotificationService = Depends()
):
    """
    Delete a notification
    """
    notification = await notification_service.get_notification(notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check if notification belongs to the current user
    if notification.user_id and notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this notification"
        )
    
    success = await notification_service.delete_notification(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete notification"
        )
    
    return None
