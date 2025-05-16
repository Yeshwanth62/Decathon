from twilio.rest import Client
from fastapi import HTTPException, status
import logging

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Twilio client
try:
    twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
except Exception as e:
    logger.error(f"Failed to initialize Twilio client: {str(e)}")
    twilio_client = None

async def send_sms(to_number: str, message: str) -> bool:
    """Send SMS using Twilio"""
    if not twilio_client:
        logger.error("Twilio client not initialized")
        return False

    if not settings.TWILIO_PHONE_NUMBER:
        logger.error("Twilio phone number not configured")
        return False

    try:
        # Format phone number to E.164 format if not already
        if not to_number.startswith('+'):
            to_number = '+' + to_number

        # Send SMS
        twilio_client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_number
        )

        logger.info(f"SMS sent to {to_number}")
        return True
    except Exception as e:
        logger.error(f"Failed to send SMS: {str(e)}")
        return False

async def send_otp(to_number: str, otp: str) -> bool:
    """Send OTP via SMS"""
    message = f"Your Sanjeevani verification code is: {otp}. This code will expire in 10 minutes."
    return await send_sms(to_number, message)

async def send_appointment_reminder(to_number: str, appointment_details: dict) -> bool:
    """Send appointment reminder via SMS"""
    doctor_name = appointment_details.get("doctor_name", "your doctor")
    date = appointment_details.get("date", "the scheduled date")
    time = appointment_details.get("time", "the scheduled time")
    location = appointment_details.get("location", "the clinic")

    message = f"Reminder: You have an appointment with {doctor_name} on {date} at {time} at {location}. Please arrive 15 minutes early."
    return await send_sms(to_number, message)

async def send_emergency_sms(to_number: str, message: str) -> bool:
    """Send emergency SMS"""
    # Add emergency prefix to message
    emergency_message = f"EMERGENCY ALERT: {message}"
    return await send_sms(to_number, emergency_message)

async def verify_phone_number(phone_number: str) -> bool:
    """Verify if a phone number is valid using Twilio Lookup API"""
    if not twilio_client:
        logger.error("Twilio client not initialized")
        return True  # Return True in development to allow testing

    try:
        # Format phone number to E.164 format if not already
        if not phone_number.startswith('+'):
            phone_number = '+' + phone_number

        # Verify phone number
        lookup = twilio_client.lookups.phone_numbers(phone_number).fetch(type=["carrier"])

        # If no exception is raised, the phone number is valid
        return True
    except Exception as e:
        logger.error(f"Failed to verify phone number: {str(e)}")
        return False