# Sanjeevani 2.0 Frontend Startup Script
Write-Host "=== Starting Sanjeevani 2.0 Frontend ===" -ForegroundColor Blue
Write-Host "This script will start the frontend server." -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 16 or higher and try again." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install npm and try again." -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Set-Location -Path "sanjeevani-frontend"

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Green
npm install

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Green
npm start

# Return to root directory (this will only run if the server is stopped)
Set-Location -Path ".."
