import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # Application settings
    APP_NAME: str = "Sanjeevani 2.0"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "sanjeevani")

    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Firebase settings
    FIREBASE_CREDENTIALS: str = os.getenv("FIREBASE_CREDENTIALS", "firebase-credentials.json")

    # Google Maps settings
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    # Twilio settings
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    # Translation settings
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: list = ["en", "hi", "kn", "te", "ta", "ml"]

    # CORS settings
    CORS_ORIGINS: list = ["*"]  # In production, replace with specific origins

    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# MongoDB collections
COLLECTIONS = {
    "users": "users",
    "patients": "patients",
    "hospitals": "hospitals",
    "doctors": "doctors",
    "appointments": "appointments",
    "medical_records": "medical_records",
    "emergency_requests": "emergency_requests",
}

# Language codes and names
LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada",
    "te": "Telugu",
    "ta": "Tamil",
    "ml": "Malayalam",
}