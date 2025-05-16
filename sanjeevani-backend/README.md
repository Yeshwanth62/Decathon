# Sanjeevani 2.0 Backend

This is the backend API for the Sanjeevani 2.0 healthcare platform. It provides endpoints for user authentication, appointment booking, doctor and hospital management, and emergency services.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Multilingual Support**: API supports multiple languages for user preferences
- **Appointment Management**: Create, read, update, and delete appointments
- **Doctor and Hospital Management**: Search and filter doctors and hospitals
- **Emergency Services**: Emergency request handling and nearby hospital search
- **Mock Data Mode**: Run the API with mock data for development and testing

## Tech Stack

- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation and settings management
- **Motor**: Asynchronous MongoDB driver
- **Uvicorn**: ASGI server for FastAPI
- **Firebase Admin**: Firebase authentication integration
- **Twilio**: SMS notifications and alerts
- **Sentry**: Error tracking and monitoring

## Getting Started

### Prerequisites

- Python 3.9 or higher
- MongoDB (optional, can run in mock data mode)
- Firebase project (optional)
- Twilio account (optional)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sanjeevani.git
   cd sanjeevani/sanjeevani-backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following variables:
   ```
   PORT=8000
   DEBUG=true
   USE_MOCK_DATA=true  # Set to false to use MongoDB
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=sanjeevani
   JWT_SECRET_KEY=your_secret_key
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=http://localhost:3000
   ```

### Running the Server

Run the server with:

```
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the provided script:

```
./start-backend.ps1  # On Windows
```

The API will be available at http://localhost:8000 and the API documentation at http://localhost:8000/docs.

## API Endpoints

### Authentication

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login user
- `POST /api/users/firebase-login`: Login with Firebase
- `GET /api/users/me`: Get current user profile
- `POST /api/users/send-otp`: Send OTP to phone
- `POST /api/users/verify-otp`: Verify OTP

### Users

- `GET /api/users/languages`: Get supported languages
- `PUT /api/users/language`: Update language preference
- `GET /api/users/profile/{role}`: Get user profile by role
- `PUT /api/users/profile/{role}`: Update user profile

### Appointments

- `GET /api/appointments`: Get all appointments
- `POST /api/appointments`: Create appointment
- `GET /api/appointments/{id}`: Get appointment by ID
- `PUT /api/appointments/{id}`: Update appointment
- `DELETE /api/appointments/{id}`: Cancel appointment
- `POST /api/appointments/reminder/{id}`: Send appointment reminder

### Emergency

- `POST /api/appointments/emergency`: Create emergency request
- `GET /api/appointments/emergency/{id}`: Get emergency request
- `POST /api/appointments/emergency/nearby-hospitals`: Find nearby hospitals

## Mock Data Mode

The API can run in mock data mode, which uses JSON files instead of a MongoDB database. This is useful for development and testing.

To enable mock data mode, set `USE_MOCK_DATA=true` in your `.env` file.

The mock data is stored in the `app/mock_data` directory and includes:
- `users.json`: User data
- `doctors.json`: Doctor data
- `hospitals.json`: Hospital data
- `appointments.json`: Appointment data

## Docker Deployment

You can also run the backend using Docker:

```
docker build -t sanjeevani-backend .
docker run -p 8000:8000 sanjeevani-backend
```

Or use Docker Compose to run the full stack:

```
docker-compose up
```
