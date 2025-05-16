import googlemaps
from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Google Maps client
try:
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize Google Maps client: {str(e)}")
    gmaps = None

async def geocode_address(address: str) -> Optional[Dict[str, float]]:
    """Convert address to coordinates"""
    if not gmaps:
        logger.error("Google Maps client not initialized")
        return None

    try:
        # Geocode address
        geocode_result = gmaps.geocode(address)

        if geocode_result and len(geocode_result) > 0:
            location = geocode_result[0]['geometry']['location']
            return {
                "latitude": location['lat'],
                "longitude": location['lng']
            }
        else:
            logger.error(f"No geocode results for address: {address}")
            return None
    except Exception as e:
        logger.error(f"Failed to geocode address: {str(e)}")
        return None

async def reverse_geocode(latitude: float, longitude: float) -> Optional[Dict[str, str]]:
    """Convert coordinates to address"""
    if not gmaps:
        logger.error("Google Maps client not initialized")
        return None

    try:
        # Reverse geocode coordinates
        reverse_geocode_result = gmaps.reverse_geocode((latitude, longitude))

        if reverse_geocode_result and len(reverse_geocode_result) > 0:
            address_components = reverse_geocode_result[0]['address_components']
            formatted_address = reverse_geocode_result[0]['formatted_address']

            # Extract address components
            address = {
                "formatted_address": formatted_address
            }

            for component in address_components:
                if 'locality' in component['types']:
                    address["city"] = component['long_name']
                elif 'administrative_area_level_1' in component['types']:
                    address["state"] = component['long_name']
                elif 'country' in component['types']:
                    address["country"] = component['long_name']
                elif 'postal_code' in component['types']:
                    address["postal_code"] = component['long_name']

            return address
        else:
            logger.error(f"No reverse geocode results for coordinates: {latitude}, {longitude}")
            return None
    except Exception as e:
        logger.error(f"Failed to reverse geocode coordinates: {str(e)}")
        return None

async def calculate_distance_matrix(origins: List[Tuple[float, float]], destinations: List[Tuple[float, float]]) -> Optional[Dict[str, Any]]:
    """Calculate distance matrix between origins and destinations"""
    if not gmaps:
        logger.error("Google Maps client not initialized")
        return None

    try:
        # Calculate distance matrix
        distance_matrix = gmaps.distance_matrix(
            origins=origins,
            destinations=destinations,
            mode="driving",
            units="metric",
            departure_time=datetime.now()
        )

        return distance_matrix
    except Exception as e:
        logger.error(f"Failed to calculate distance matrix: {str(e)}")
        return None

async def find_nearby_hospitals(latitude: float, longitude: float, radius: int = 5000) -> Optional[List[Dict[str, Any]]]:
    """Find nearby hospitals within a radius (in meters)"""
    if not gmaps:
        logger.error("Google Maps client not initialized")
        return None

    try:
        # Find nearby hospitals
        places_result = gmaps.places_nearby(
            location=(latitude, longitude),
            radius=radius,
            type='hospital'
        )

        if places_result and 'results' in places_result:
            hospitals = []

            for place in places_result['results']:
                hospital = {
                    "name": place['name'],
                    "place_id": place['place_id'],
                    "location": {
                        "latitude": place['geometry']['location']['lat'],
                        "longitude": place['geometry']['location']['lng']
                    },
                    "vicinity": place.get('vicinity', '')
                }

                # Get additional details if available
                if 'rating' in place:
                    hospital["rating"] = place['rating']

                hospitals.append(hospital)

            return hospitals
        else:
            logger.error(f"No nearby hospitals found for coordinates: {latitude}, {longitude}")
            return []
    except Exception as e:
        logger.error(f"Failed to find nearby hospitals: {str(e)}")
        return None

async def get_directions(origin: Tuple[float, float], destination: Tuple[float, float], mode: str = "driving") -> Optional[Dict[str, Any]]:
    """Get directions from origin to destination"""
    if not gmaps:
        logger.error("Google Maps client not initialized")
        return None

    try:
        # Get directions
        directions_result = gmaps.directions(
            origin=origin,
            destination=destination,
            mode=mode,
            departure_time=datetime.now()
        )

        if directions_result and len(directions_result) > 0:
            return directions_result[0]
        else:
            logger.error(f"No directions found from {origin} to {destination}")
            return None
    except Exception as e:
        logger.error(f"Failed to get directions: {str(e)}")
        return None