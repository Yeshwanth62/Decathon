# Sanjeevani 2.0 Application Launcher
Write-Host "=== Sanjeevani 2.0 Application Launcher ===" -ForegroundColor Blue
Write-Host "This script will open the Sanjeevani 2.0 application in your default browser." -ForegroundColor Yellow
Write-Host ""

# Check if the application is running locally
$localRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $localRunning = $true
    }
} catch {
    $localRunning = $false
}

# Check if the application is running in Docker
$dockerRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $dockerRunning = $true
    }
} catch {
    $dockerRunning = $false
}

# Open the application
if ($localRunning) {
    Write-Host "Opening the application at http://localhost:3000" -ForegroundColor Green
    Start-Process "http://localhost:3000"
} elseif ($dockerRunning) {
    Write-Host "Opening the application at http://localhost:8080" -ForegroundColor Green
    Start-Process "http://localhost:8080"
} else {
    Write-Host "The application is not running locally or in Docker." -ForegroundColor Yellow
    Write-Host "Would you like to start the application? (Y/N)" -ForegroundColor Cyan
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "Starting the application..." -ForegroundColor Green
        Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd sanjeevani-frontend; npm start" -NoNewWindow
        
        Write-Host "Waiting for the application to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "Opening the application at http://localhost:3000" -ForegroundColor Green
        Start-Process "http://localhost:3000"
    } else {
        Write-Host "Application not started. You can start it manually with:" -ForegroundColor Yellow
        Write-Host "cd sanjeevani-frontend; npm start" -ForegroundColor Cyan
    }
}
