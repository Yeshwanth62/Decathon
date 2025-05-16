from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pymongo import MongoClient
from bson import ObjectId
from fastapi import HTTPException, status
import googlemaps

from models.appointment import EmergencyRequestCreate, EmergencyRequestStatus
from config import settings, COLLECTIONS
from integrations.twilio_integration import send_emergency_sms

# MongoDB connection
client = MongoClient(settings.MONGODB_URL)
db = client[settings.MONGODB_DB_NAME]
emergency_requests_collection = db[COLLECTIONS["emergency_requests"]]
users_collection = db[COLLECTIONS["users"]]
patients_collection = db[COLLECTIONS["patients"]]
hospitals_collection = db[COLLECTIONS["hospitals"]]

# Google Maps client
gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

async def create_emergency_request(emergency_request: EmergencyRequestCreate, user_id: str) -> Dict[str, Any]:
    """Create a new emergency request"""
    # Check if patient exists
    patient = patients_collection.find_one({"user_id": emergency_request.patient_id})
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )

    # Find nearest hospitals with emergency services
    nearest_hospital = await find_nearest_hospital(emergency_request.location)

    # Create emergency request
    emergency_dict = emergency_request.dict()
    emergency_dict.update({
        "status": EmergencyRequestStatus.PENDING.value,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "created_by": user_id,
        "hospital_id": nearest_hospital["user_id"] if nearest_hospital else None,
        "estimated_arrival_time": calculate_eta(emergency_request.location, nearest_hospital["location"]) if nearest_hospital else None
    })

    result = emergency_requests_collection.insert_one(emergency_dict)

    # Get the created emergency request
    created_request = emergency_requests_collection.find_one({"_id": result.inserted_id})
    created_request["id"] = str(created_request["_id"])
    del created_request["_id"]

    # Send SMS notification to patient
    patient_user = users_collection.find_one({"_id": ObjectId(emergency_request.patient_id)})
    if patient_user and patient_user.get("phone"):
        await send_emergency_sms(
            patient_user["phone"],
            f"Your emergency request has been received. An ambulance will arrive in approximately {calculate_eta_minutes(emergency_request.location, nearest_hospital['location']) if nearest_hospital else 'unknown'} minutes."
        )

    # Send SMS notification to hospital
    if nearest_hospital:
        hospital_user = users_collection.find_one({"_id": ObjectId(nearest_hospital["user_id"])})
        if hospital_user and hospital_user.get("phone"):
            await send_emergency_sms(
                hospital_user["phone"],
                f"Emergency request received. Patient location: {emergency_request.address if emergency_request.address else 'Unknown'}. Please dispatch ambulance immediately."
            )

    return created_request

async def get_emergency_request(request_id: str) -> Dict[str, Any]:
    """Get emergency request by ID"""
    try:
        request = emergency_requests_collection.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid emergency request ID"
        )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency request not found"
        )

    request["id"] = str(request["_id"])
    del request["_id"]

    return request

async def update_emergency_status(request_id: str, status: EmergencyRequestStatus, ambulance_id: Optional[str] = None) -> Dict[str, Any]:
    """Update emergency request status"""
    try:
        request = emergency_requests_collection.find_one({"_id": ObjectId(request_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid emergency request ID"
        )

    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Emergency request not found"
        )

    # Update status
    update_data = {
        "status": status.value,
        "updated_at": datetime.now()
    }

    if ambulance_id:
        update_data["ambulance_id"] = ambulance_id

    emergency_requests_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": update_data}
    )

    # Get updated request
    updated_request = emergency_requests_collection.find_one({"_id": ObjectId(request_id)})
    updated_request["id"] = str(updated_request["_id"])
    del updated_request["_id"]

    # Send SMS notification to patient
    patient_user = users_collection.find_one({"_id": ObjectId(request["patient_id"])})
    if patient_user and patient_user.get("phone"):
        status_message = {
            EmergencyRequestStatus.ACCEPTED.value: "Your emergency request has been accepted by the hospital.",
            EmergencyRequestStatus.DISPATCHED.value: "An ambulance has been dispatched to your location.",
            EmergencyRequestStatus.COMPLETED.value: "Your emergency request has been completed.",
            EmergencyRequestStatus.CANCELLED.value: "Your emergency request has been cancelled."
        }

        await send_emergency_sms(
            patient_user["phone"],
            status_message.get(status.value, f"Your emergency request status has been updated to {status.value}.")
        )

    return updated_request

async def find_nearest_hospital(location: Dict[str, float]) -> Optional[Dict[str, Any]]:
    """Find the nearest hospital with emergency services"""
    hospitals = list(hospitals_collection.find({"emergency_services": True}))

    if not hospitals:
        return None

    # Get hospital locations
    hospital_locations = []
    for hospital in hospitals:
        if "address" in hospital and "location" in hospital:
            hospital_locations.append({
                "user_id": hospital["user_id"],
                "location": hospital["location"],
                "name": hospital.get("name", "Unknown Hospital")
            })

    if not hospital_locations:
        return None

    # Calculate distances using Google Maps Distance Matrix API
    origins = [(location["latitude"], location["longitude"])]
    destinations = [(h["location"]["latitude"], h["location"]["longitude"]) for h in hospital_locations]

    try:
        distance_matrix = gmaps.distance_matrix(
            origins=origins,
            destinations=destinations,
            mode="driving",
            units="metric"
        )

        # Find the nearest hospital
        min_distance = float('inf')
        nearest_hospital = None

        for i, row in enumerate(distance_matrix["rows"]):
            for j, element in enumerate(row["elements"]):
                if element["status"] == "OK":
                    distance = element["distance"]["value"]  # in meters
                    if distance < min_distance:
                        min_distance = distance
                        nearest_hospital = hospital_locations[j]

        return nearest_hospital
    except Exception as e:
        # Fallback to simple distance calculation if Google Maps API fails
        min_distance = float('inf')
        nearest_hospital = None

        for hospital in hospital_locations:
            distance = calculate_distance(
                location["latitude"], location["longitude"],
                hospital["location"]["latitude"], hospital["location"]["longitude"]
            )
            if distance < min_distance:
                min_distance = distance
                nearest_hospital = hospital

        return nearest_hospital

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    from math import radians, cos, sin, asin, sqrt

    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers

    return c * r * 1000  # Convert to meters

def calculate_eta(origin: Dict[str, float], destination: Dict[str, float]) -> datetime:
    """Calculate estimated time of arrival"""
    try:
        directions = gmaps.directions(
            origin=(origin["latitude"], origin["longitude"]),
            destination=(destination["latitude"], destination["longitude"]),
            mode="driving"
        )

        if directions and len(directions) > 0:
            duration_seconds = directions[0]["legs"][0]["duration"]["value"]
            return datetime.now() + timedelta(seconds=duration_seconds)
    except:
        pass

    # Fallback: assume 30 minutes if Google Maps API fails
    return datetime.now() + timedelta(minutes=30)

def calculate_eta_minutes(origin: Dict[str, float], destination: Dict[str, float]) -> int:
    """Calculate estimated time of arrival in minutes"""
    try:
        directions = gmaps.directions(
            origin=(origin["latitude"], origin["longitude"]),
            destination=(destination["latitude"], destination["longitude"]),
            mode="driving"
        )

        if directions and len(directions) > 0:
            duration_seconds = directions[0]["legs"][0]["duration"]["value"]
            return int(duration_seconds / 60)
    except:
        pass

    # Fallback: assume 30 minutes if Google Maps API fails
    return 30