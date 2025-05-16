import firebase_admin
from firebase_admin import credentials, auth
import os
import json
import logging
from typing import Optional, Dict, Any

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
try:
    # Check if credentials file exists
    if os.path.exists(settings.FIREBASE_CREDENTIALS):
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    else:
        # If file doesn't exist, try to use environment variable
        firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if firebase_credentials_json:
            # Parse JSON from environment variable
            cred_dict = json.loads(firebase_credentials_json)
            cred = credentials.Certificate(cred_dict)
        else:
            logger.error("Firebase credentials not found")
            cred = None

    # Initialize Firebase Admin SDK if credentials are available
    if cred:
        firebase_app = firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
    else:
        firebase_app = None
        logger.error("Failed to initialize Firebase Admin SDK")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
    firebase_app = None

async def verify_firebase_token(id_token: str) -> Optional[Dict[str, Any]]:
    """Verify Firebase ID token"""
    if not firebase_app:
        logger.error("Firebase Admin SDK not initialized")
        return None

    try:
        # Verify ID token
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Failed to verify Firebase ID token: {str(e)}")
        return None

async def get_firebase_user(uid: str) -> Optional[Dict[str, Any]]:
    """Get Firebase user by UID"""
    if not firebase_app:
        logger.error("Firebase Admin SDK not initialized")
        return None

    try:
        # Get user by UID
        user = auth.get_user(uid)
        return user.__dict__
    except Exception as e:
        logger.error(f"Failed to get Firebase user: {str(e)}")
        return None

async def create_firebase_user(email: str, password: str, display_name: str = None, phone_number: str = None) -> Optional[Dict[str, Any]]:
    """Create a new Firebase user"""
    if not firebase_app:
        logger.error("Firebase Admin SDK not initialized")
        return None

    try:
        # Create user
        user_properties = {
            "email": email,
            "password": password,
            "email_verified": False
        }

        if display_name:
            user_properties["display_name"] = display_name

        if phone_number:
            # Format phone number to E.164 format if not already
            if not phone_number.startswith('+'):
                phone_number = '+' + phone_number
            user_properties["phone_number"] = phone_number

        user = auth.create_user(**user_properties)
        return user.__dict__
    except Exception as e:
        logger.error(f"Failed to create Firebase user: {str(e)}")
        return None

async def update_firebase_user(uid: str, properties: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update Firebase user properties"""
    if not firebase_app:
        logger.error("Firebase Admin SDK not initialized")
        return None

    try:
        # Update user
        user = auth.update_user(uid, **properties)
        return user.__dict__
    except Exception as e:
        logger.error(f"Failed to update Firebase user: {str(e)}")
        return None

async def delete_firebase_user(uid: str) -> bool:
    """Delete Firebase user"""
    if not firebase_app:
        logger.error("Firebase Admin SDK not initialized")
        return False

    try:
        # Delete user
        auth.delete_user(uid)
        return True
    except Exception as e:
        logger.error(f"Failed to delete Firebase user: {str(e)}")
        return False