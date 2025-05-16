"""
Configuration settings for Sanjeevani 2.0
"""

import os
from typing import List, Optional, Union
from pydantic import BaseSettings, AnyHttpUrl, validator


class Settings(BaseSettings):
    """Application settings"""
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Sanjeevani 2.0"
    PROJECT_DESCRIPTION: str = "Healthcare platform with multilingual support and advanced features"
    PROJECT_VERSION: str = "1.0.0"
    
    # CORS settings
    CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["http://localhost:3000"]
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "sanjeevani")
    
    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # Firebase settings
    FIREBASE_CREDENTIALS: Optional[str] = os.getenv("FIREBASE_CREDENTIALS")
    
    # Twilio settings
    TWILIO_ACCOUNT_SID: Optional[str] = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: Optional[str] = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER: Optional[str] = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Google Maps settings
    GOOGLE_MAPS_API_KEY: Optional[str] = os.getenv("GOOGLE_MAPS_API_KEY")
    
    # Debug mode
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
