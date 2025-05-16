"""
Common models and utilities for Sanjeevani 2.0
"""

from typing import Any, Optional
from bson import ObjectId
from pydantic import BaseModel, Field


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(BaseModel):
    """Base model for MongoDB documents"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class PaginatedResponse(BaseModel):
    """Base model for paginated responses"""
    total: int
    page: int
    limit: int
    pages: int
    items: list[Any]

    class Config:
        schema_extra = {
            "example": {
                "total": 100,
                "page": 1,
                "limit": 10,
                "pages": 10,
                "items": []
            }
        }
