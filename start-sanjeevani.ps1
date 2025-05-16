# Sanjeevani 2.0 Local Development Startup Script
# This script sets up and starts both the frontend and backend servers for local development

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 Local Development Setup ===" -ForegroundColor $Blue
Write-Host "This script will set up and start the Sanjeevani 2.0 application for local development." -ForegroundColor $Yellow
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

# Create MongoDB data directory if it doesn't exist
if (-not (Test-Path "data\db")) {
    Write-Host "Creating MongoDB data directory..." -ForegroundColor $Green
    New-Item -Path "data\db" -ItemType Directory -Force | Out-Null
}

# Function to start MongoDB
function Start-MongoDB {
    Write-Host "Starting MongoDB..." -ForegroundColor $Green
    
    # Check if MongoDB is installed
    if (Test-CommandExists mongod) {
        # Start MongoDB
        Start-Process -FilePath "mongod" -ArgumentList "--dbpath=data\db" -NoNewWindow
        Write-Host "MongoDB started successfully." -ForegroundColor $Green
        return $true
    } else {
        Write-Host "MongoDB is not installed. Please install MongoDB and try again." -ForegroundColor $Red
        Write-Host "You can download MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor $Yellow
        return $false
    }
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
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=sanjeevani
JWT_SECRET_KEY=local_development_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding utf8
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
$MongoDBStarted = Start-MongoDB
if ($MongoDBStarted) {
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
}
