"""
Socket.io manager for Sanjeevani 2.0
Handles real-time notifications and events
"""

import json
import logging
from typing import Dict, List, Optional, Any
import asyncio
from datetime import datetime

import socketio
from fastapi import FastAPI
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import decode_access_token
from app.models.notification import NotificationType, Notification
from app.services.notification_service import NotificationService

# Configure logging
logger = logging.getLogger(__name__)

# Create Socket.io server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=settings.CORS_ORIGINS,
    logger=True,
    engineio_logger=True if settings.DEBUG else False,
)

# User connection storage
connected_users: Dict[str, List[str]] = {}  # user_id -> list of sid
user_rooms: Dict[str, List[str]] = {}  # user_id -> list of rooms


class SocketManager:
    """Socket.io manager for handling real-time events"""

    def __init__(self, app: FastAPI, notification_service: NotificationService):
        """Initialize the Socket.io manager"""
        self.app = app
        self.notification_service = notification_service
        self.socket_app = socketio.ASGIApp(sio)
        self.setup_routes()

    def setup_routes(self):
        """Set up Socket.io event handlers"""
        @sio.event
        async def connect(sid, environ, auth):
            """Handle client connection"""
            try:
                if not auth or "token" not in auth:
                    await sio.disconnect(sid)
                    logger.warning(f"Connection rejected: No auth token provided")
                    return False

                # Verify JWT token
                token = auth["token"]
                payload = decode_access_token(token)
                if not payload:
                    await sio.disconnect(sid)
                    logger.warning(f"Connection rejected: Invalid token")
                    return False

                user_id = payload.get("sub")
                if not user_id:
                    await sio.disconnect(sid)
                    logger.warning(f"Connection rejected: No user ID in token")
                    return False

                # Store user connection
                if user_id not in connected_users:
                    connected_users[user_id] = []
                connected_users[user_id].append(sid)

                # Join user-specific room
                user_room = f"user:{user_id}"
                await sio.enter_room(sid, user_room)

                # Join role-specific room
                role = payload.get("role", "patient")
                role_room = f"role:{role}"
                await sio.enter_room(sid, role_room)

                # Track rooms for this user
                if user_id not in user_rooms:
                    user_rooms[user_id] = []
                user_rooms[user_id].extend([user_room, role_room])

                logger.info(f"User {user_id} connected with sid {sid}")
                return True
            except Exception as e:
                logger.error(f"Error in connect handler: {str(e)}")
                await sio.disconnect(sid)
                return False

        @sio.event
        async def disconnect(sid):
            """Handle client disconnection"""
            try:
                # Find and remove user from connected_users
                user_id = None
                for uid, sids in connected_users.items():
                    if sid in sids:
                        user_id = uid
                        sids.remove(sid)
                        if not sids:  # No more connections for this user
                            del connected_users[uid]
                        break

                if user_id:
                    logger.info(f"User {user_id} disconnected (sid: {sid})")
                else:
                    logger.info(f"Unknown client disconnected (sid: {sid})")
            except Exception as e:
                logger.error(f"Error in disconnect handler: {str(e)}")

        @sio.event
        async def join_room(sid, data):
            """Handle room joining request"""
            try:
                room = data.get("room")
                if not room:
                    return {"success": False, "error": "Room name is required"}

                await sio.enter_room(sid, room)
                logger.info(f"Client {sid} joined room {room}")
                return {"success": True}
            except Exception as e:
                logger.error(f"Error in join_room handler: {str(e)}")
                return {"success": False, "error": str(e)}

        @sio.event
        async def leave_room(sid, data):
            """Handle room leaving request"""
            try:
                room = data.get("room")
                if not room:
                    return {"success": False, "error": "Room name is required"}

                await sio.leave_room(sid, room)
                logger.info(f"Client {sid} left room {room}")
                return {"success": True}
            except Exception as e:
                logger.error(f"Error in leave_room handler: {str(e)}")
                return {"success": False, "error": str(e)}

    async def send_notification(self, user_id: str, notification: Notification):
        """Send notification to a specific user"""
        try:
            # Save notification to database
            await self.notification_service.create_notification(notification)

            # Send to user's room
            user_room = f"user:{user_id}"
            await sio.emit("notification", notification.dict(), room=user_room)
            logger.info(f"Notification sent to user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error sending notification: {str(e)}")
            return False

    async def send_broadcast(self, role: Optional[str], notification: Notification):
        """Send broadcast notification to all users or users with specific role"""
        try:
            # Save notification to database
            await self.notification_service.create_notification(notification)

            if role:
                # Send to role-specific room
                role_room = f"role:{role}"
                await sio.emit("notification", notification.dict(), room=role_room)
                logger.info(f"Broadcast notification sent to role {role}")
            else:
                # Send to all connected clients
                await sio.emit("notification", notification.dict())
                logger.info("Broadcast notification sent to all users")
            return True
        except Exception as e:
            logger.error(f"Error sending broadcast: {str(e)}")
            return False

    async def send_emergency_alert(self, location: Dict[str, float], user_id: str, details: Dict[str, Any]):
        """Send emergency alert to nearby hospitals and admins"""
        try:
            # Create emergency notification
            notification = Notification(
                title="Emergency Alert",
                message=f"Emergency request from a patient",
                type=NotificationType.EMERGENCY,
                data={
                    "location": location,
                    "user_id": user_id,
                    "timestamp": datetime.now().isoformat(),
                    "details": details
                }
            )

            # Send to hospitals and admins
            await sio.emit("emergency", notification.dict(), room="role:hospital")
            await sio.emit("emergency", notification.dict(), room="role:admin")
            
            # Also send confirmation to the user
            user_room = f"user:{user_id}"
            await sio.emit("emergency_confirmed", {
                "message": "Emergency alert sent to nearby hospitals",
                "timestamp": datetime.now().isoformat()
            }, room=user_room)
            
            logger.info(f"Emergency alert sent for user {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error sending emergency alert: {str(e)}")
            return False

    def get_socket_app(self):
        """Get the Socket.io ASGI app for mounting in FastAPI"""
        return self.socket_app
