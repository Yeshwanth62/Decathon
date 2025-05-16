# Sanjeevani 2.0 Simple Local Development Startup Script
# This script sets up and starts both the frontend and backend servers for local development
# without requiring MongoDB to be installed

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 Simple Local Development Setup ===" -ForegroundColor $Blue
Write-Host "This script will set up and start the Sanjeevani 2.0 application for local development." -ForegroundColor $Yellow
Write-Host "Note: This version uses mock data instead of MongoDB." -ForegroundColor $Yellow
Write-Host ""

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Check for required tools
Write-Host "Checking for required tools..." -ForegroundColor $Yellow
$MissingTools = @()

if (-not (Test-CommandExists node)) {
    $MissingTools += "node"
}

if (-not (Test-CommandExists npm)) {
    $MissingTools += "npm"
}

if (-not (Test-CommandExists python)) {
    $MissingTools += "python"
}

if (-not (Test-CommandExists pip)) {
    $MissingTools += "pip"
}

if ($MissingTools.Count -gt 0) {
    Write-Host "The following required tools are missing:" -ForegroundColor $Red
    foreach ($Tool in $MissingTools) {
        Write-Host "  - $Tool" -ForegroundColor $Red
    }
    Write-Host "Please install these tools and try again." -ForegroundColor $Yellow
    exit 1
}

# Check Node.js version
$NodeVersion = (node --version).Substring(1)
$NodeMajorVersion = [int]($NodeVersion.Split('.')[0])
if ($NodeMajorVersion -lt 16) {
    Write-Host "Node.js version $NodeVersion is not supported. Please upgrade to Node.js 16 or higher." -ForegroundColor $Red
    exit 1
}

# Check Python version
$PythonVersion = (python --version).Split(' ')[1]
$PythonMajorVersion = [int]($PythonVersion.Split('.')[0])
$PythonMinorVersion = [int]($PythonVersion.Split('.')[1])
if ($PythonMajorVersion -lt 3 -or ($PythonMajorVersion -eq 3 -and $PythonMinorVersion -lt 9)) {
    Write-Host "Python version $PythonVersion is not supported. Please upgrade to Python 3.9 or higher." -ForegroundColor $Red
    exit 1
}

# Function to set up and start the backend
function Start-Backend {
    Write-Host "Setting up backend..." -ForegroundColor $Green
    
    # Navigate to backend directory
    Set-Location -Path "sanjeevani-backend"
    
    # Create virtual environment if it doesn't exist
    if (-not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor $Green
        python -m venv venv
    }
    
    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor $Green
    & .\venv\Scripts\Activate.ps1
    
    # Install dependencies
    Write-Host "Installing backend dependencies..." -ForegroundColor $Green
    pip install -r requirements.txt
    
    # Create .env file if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..." -ForegroundColor $Green
        @"
PORT=8000
DEBUG=true
USE_MOCK_DATA=true
JWT_SECRET_KEY=local_development_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding utf8
    }
    
    # Create mock data directory if it doesn't exist
    if (-not (Test-Path "app\mock_data")) {
        Write-Host "Creating mock data directory..." -ForegroundColor $Green
        New-Item -Path "app\mock_data" -ItemType Directory -Force | Out-Null
        
        # Create mock data files
        @"
[
  {
    "id": "1",
    "name": "Dr. Rajesh Kumar",
    "specialty": "Cardiology",
    "hospital": "City Hospital",
    "availability": [
      {"day": "Monday", "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]},
      {"day": "Wednesday", "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]},
      {"day": "Friday", "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]}
    ],
    "rating": 4.8,
    "experience": 15,
    "education": "MBBS, MD (Cardiology)",
    "languages": ["English", "Hindi", "Kannada"],
    "profile_image": "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    "id": "2",
    "name": "Dr. Priya Sharma",
    "specialty": "Pediatrics",
    "hospital": "Children's Hospital",
    "availability": [
      {"day": "Tuesday", "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]},
      {"day": "Thursday", "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]},
      {"day": "Saturday", "slots": ["09:00", "10:00", "11:00"]}
    ],
    "rating": 4.9,
    "experience": 12,
    "education": "MBBS, MD (Pediatrics)",
    "languages": ["English", "Hindi", "Tamil"],
    "profile_image": "https://randomuser.me/api/portraits/women/2.jpg"
  }
]
"@ | Out-File -FilePath "app\mock_data\doctors.json" -Encoding utf8
        
        @"
[
  {
    "id": "1",
    "name": "City Hospital",
    "address": "123 Main Street, Bangalore",
    "phone": "+91 9876543210",
    "email": "info@cityhospital.com",
    "website": "https://www.cityhospital.com",
    "specialties": ["Cardiology", "Neurology", "Orthopedics", "General Surgery"],
    "emergency_services": true,
    "rating": 4.7,
    "location": {"latitude": 12.9716, "longitude": 77.5946},
    "image": "https://images.unsplash.com/photo-1587351021759-3e566b3db4f1"
  },
  {
    "id": "2",
    "name": "Children's Hospital",
    "address": "456 Park Avenue, Bangalore",
    "phone": "+91 9876543211",
    "email": "info@childrenshospital.com",
    "website": "https://www.childrenshospital.com",
    "specialties": ["Pediatrics", "Pediatric Surgery", "Neonatology"],
    "emergency_services": true,
    "rating": 4.9,
    "location": {"latitude": 12.9766, "longitude": 77.5993},
    "image": "https://images.unsplash.com/photo-1588776814546-daab30f310ce"
  }
]
"@ | Out-File -FilePath "app\mock_data\hospitals.json" -Encoding utf8
        
        @"
[
  {
    "id": "1",
    "user_id": "1",
    "doctor_id": "1",
    "hospital_id": "1",
    "date": "2023-05-20",
    "time": "09:00",
    "status": "confirmed",
    "reason": "Regular checkup",
    "notes": "Bring previous reports",
    "created_at": "2023-05-15T10:30:00Z"
  },
  {
    "id": "2",
    "user_id": "1",
    "doctor_id": "2",
    "hospital_id": "2",
    "date": "2023-05-22",
    "time": "10:00",
    "status": "pending",
    "reason": "Fever and cold",
    "notes": "",
    "created_at": "2023-05-15T11:45:00Z"
  }
]
"@ | Out-File -FilePath "app\mock_data\appointments.json" -Encoding utf8
        
        @"
[
  {
    "id": "1",
    "email": "patient@example.com",
    "name": "John Doe",
    "phone": "+91 9876543212",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "blood_group": "O+",
    "address": "789 Oak Street, Bangalore",
    "emergency_contacts": [
      {
        "name": "Jane Doe",
        "relationship": "Spouse",
        "phone": "+91 9876543213"
      }
    ],
    "medical_history": [
      {
        "condition": "Hypertension",
        "diagnosed_date": "2020-03-10",
        "medications": ["Amlodipine 5mg"]
      }
    ],
    "allergies": ["Penicillin"],
    "created_at": "2023-01-01T00:00:00Z"
  }
]
"@ | Out-File -FilePath "app\mock_data\users.json" -Encoding utf8
    }
    
    # Create mock data handler if it doesn't exist
    if (-not (Test-Path "app\db\mock_data_handler.py")) {
        Write-Host "Creating mock data handler..." -ForegroundColor $Green
        New-Item -Path "app\db" -ItemType Directory -Force | Out-Null
        
        @"
import json
import os
from pathlib import Path

class MockDataHandler:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent / "mock_data"
        self.data = {}
        self._load_data()
    
    def _load_data(self):
        for file_path in self.base_path.glob("*.json"):
            collection_name = file_path.stem
            with open(file_path, "r") as f:
                self.data[collection_name] = json.load(f)
    
    async def find_one(self, collection, query):
        if collection not in self.data:
            return None
        
        for item in self.data[collection]:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                return item
        
        return None
    
    async def find(self, collection, query=None, limit=None):
        if collection not in self.data:
            return []
        
        if query is None:
            results = self.data[collection]
        else:
            results = []
            for item in self.data[collection]:
                match = True
                for key, value in query.items():
                    if key not in item or item[key] != value:
                        match = False
                        break
                
                if match:
                    results.append(item)
        
        if limit is not None:
            results = results[:limit]
        
        return results
    
    async def insert_one(self, collection, document):
        if collection not in self.data:
            self.data[collection] = []
        
        self.data[collection].append(document)
        self._save_data(collection)
        
        return {"inserted_id": document["id"]}
    
    async def update_one(self, collection, query, update):
        if collection not in self.data:
            return {"modified_count": 0}
        
        modified_count = 0
        for i, item in enumerate(self.data[collection]):
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                # Handle $set operator
                if "$set" in update:
                    for key, value in update["$set"].items():
                        self.data[collection][i][key] = value
                
                modified_count += 1
                self._save_data(collection)
                break
        
        return {"modified_count": modified_count}
    
    async def delete_one(self, collection, query):
        if collection not in self.data:
            return {"deleted_count": 0}
        
        deleted_count = 0
        for i, item in enumerate(self.data[collection]):
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                del self.data[collection][i]
                deleted_count += 1
                self._save_data(collection)
                break
        
        return {"deleted_count": deleted_count}
    
    def _save_data(self, collection):
        file_path = self.base_path / f"{collection}.json"
        with open(file_path, "w") as f:
            json.dump(self.data[collection], f, indent=2)

mock_db = MockDataHandler()
"@ | Out-File -FilePath "app\db\mock_data_handler.py" -Encoding utf8
    }
    
    # Modify database connection to use mock data if needed
    if (-not (Test-Path "app\db\database.py")) {
        Write-Host "Creating database connection file..." -ForegroundColor $Green
        @"
import os
from motor.motor_asyncio import AsyncIOMotorClient
from .mock_data_handler import mock_db

USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"

class Database:
    client = None
    db = None
    
    @classmethod
    async def connect(cls):
        if USE_MOCK_DATA:
            print("Using mock data instead of MongoDB")
            return
        
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        mongodb_db_name = os.getenv("MONGODB_DB_NAME", "sanjeevani")
        
        cls.client = AsyncIOMotorClient(mongodb_url)
        cls.db = cls.client[mongodb_db_name]
        print(f"Connected to MongoDB: {mongodb_url}/{mongodb_db_name}")
    
    @classmethod
    async def close(cls):
        if not USE_MOCK_DATA and cls.client:
            cls.client.close()
            print("Closed MongoDB connection")
    
    @classmethod
    async def get_collection(cls, collection_name):
        if USE_MOCK_DATA:
            return MockCollection(collection_name)
        
        return cls.db[collection_name]

class MockCollection:
    def __init__(self, collection_name):
        self.collection_name = collection_name
    
    async def find_one(self, query):
        return await mock_db.find_one(self.collection_name, query)
    
    async def find(self, query=None, limit=None):
        return await mock_db.find(self.collection_name, query, limit)
    
    async def insert_one(self, document):
        return await mock_db.insert_one(self.collection_name, document)
    
    async def update_one(self, query, update):
        return await mock_db.update_one(self.collection_name, query, update)
    
    async def delete_one(self, query):
        return await mock_db.delete_one(self.collection_name, query)

database = Database()
"@ | Out-File -FilePath "app\db\database.py" -Encoding utf8
    }
    
    # Start backend server
    Write-Host "Starting backend server..." -ForegroundColor $Green
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "& {. .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000}" -NoNewWindow
    
    # Return to root directory
    Set-Location -Path ".."
    
    Write-Host "Backend server started successfully." -ForegroundColor $Green
}

# Function to set up and start the frontend
function Start-Frontend {
    Write-Host "Setting up frontend..." -ForegroundColor $Green
    
    # Navigate to frontend directory
    Set-Location -Path "sanjeevani-frontend"
    
    # Install dependencies
    Write-Host "Installing frontend dependencies..." -ForegroundColor $Green
    npm install
    
    # Create .env file if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file..." -ForegroundColor $Green
        @"
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
REACT_APP_ENABLE_VOICE_COMMANDS=true
REACT_APP_ENABLE_3D_MODELS=true
REACT_APP_ENABLE_EMERGENCY=true
REACT_APP_MAX_3D_QUALITY=high
"@ | Out-File -FilePath ".env" -Encoding utf8
    }
    
    # Start frontend server
    Write-Host "Starting frontend server..." -ForegroundColor $Green
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "npm start" -NoNewWindow
    
    # Return to root directory
    Set-Location -Path ".."
    
    Write-Host "Frontend server started successfully." -ForegroundColor $Green
}

# Main execution
Start-Backend
Start-Frontend

Write-Host ""
Write-Host "Sanjeevani 2.0 is now running!" -ForegroundColor $Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor $Blue
Write-Host "Backend: http://localhost:8000" -ForegroundColor $Blue
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor $Blue
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers." -ForegroundColor $Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Stopping servers..." -ForegroundColor $Yellow
    # Add cleanup code here if needed
}
