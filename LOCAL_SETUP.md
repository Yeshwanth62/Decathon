# Sanjeevani 2.0 Local Development Setup

This guide provides instructions for setting up and running Sanjeevani 2.0 on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **Python** (version 3.9 or higher)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

## Quick Start

For the easiest setup, simply run:

```
start-sanjeevani.bat
```

This will:
1. Set up the backend with mock data (no MongoDB required)
2. Set up the frontend
3. Start both servers

## Manual Setup

If you prefer to set up the application manually, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd sanjeevani-backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```
   venv\Scripts\activate
   ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file with the following content:
   ```
   PORT=8000
   DEBUG=true
   USE_MOCK_DATA=true
   JWT_SECRET_KEY=local_development_secret_key
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=http://localhost:3000
   ```

6. Start the backend server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd sanjeevani-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_SOCKET_URL=http://localhost:8000
   REACT_APP_ENABLE_VOICE_COMMANDS=true
   REACT_APP_ENABLE_3D_MODELS=true
   REACT_APP_ENABLE_EMERGENCY=true
   REACT_APP_MAX_3D_QUALITY=high
   ```

4. Start the frontend server:
   ```
   npm start
   ```

## Accessing the Application

Once both servers are running, you can access the application at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Test Accounts

The application is set up with the following test accounts:

- **Patient**:
  - Email: patient@example.com
  - Password: password123

## Using MongoDB (Optional)

If you want to use MongoDB instead of mock data:

1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update the `.env` file in the backend directory:
   ```
   PORT=8000
   DEBUG=true
   USE_MOCK_DATA=false
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=sanjeevani
   JWT_SECRET_KEY=local_development_secret_key
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=http://localhost:3000
   ```

## Troubleshooting

### "ERR_CONNECTION_REFUSED" Error

If you see this error when accessing the frontend or backend:

1. Make sure both servers are running
2. Check that the ports (3000 for frontend, 8000 for backend) are not being used by other applications
3. Verify that your firewall is not blocking the connections

### Backend Server Not Starting

If the backend server fails to start:

1. Make sure Python 3.9+ is installed
2. Check that all dependencies are installed correctly
3. Verify that the virtual environment is activated

### Frontend Server Not Starting

If the frontend server fails to start:

1. Make sure Node.js 16+ is installed
2. Check that all dependencies are installed correctly
3. Verify that the `.env` file is created correctly

## Need Help?

If you encounter any issues, please contact the development team at support@sanjeevani-health.com.
