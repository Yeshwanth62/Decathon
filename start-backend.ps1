# Sanjeevani 2.0 Backend Startup Script
Write-Host "=== Starting Sanjeevani 2.0 Backend ===" -ForegroundColor Blue
Write-Host "This script will start the backend server." -ForegroundColor Yellow
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Python is installed: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is not installed. Please install Python 3.9 or higher and try again." -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path "sanjeevani-backend/venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Green
    Set-Location -Path "sanjeevani-backend"
    python -m venv venv
    Set-Location -Path ".."
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
Set-Location -Path "sanjeevani-backend"
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green
pip install -r requirements.txt

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Green
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Deactivate virtual environment (this will only run if the server is stopped)
deactivate
Set-Location -Path ".."
