# Sanjeevani 2.0 Netlify Deployment Script
Write-Host "=== Sanjeevani 2.0 Netlify Deployment Script ===" -ForegroundColor Blue
Write-Host "This script will deploy the Sanjeevani 2.0 application to Netlify." -ForegroundColor Yellow
Write-Host ""

# Check if build directory exists
if (-not (Test-Path -Path "sanjeevani-frontend/build")) {
    Write-Host "Build directory not found. Building the application..." -ForegroundColor Yellow
    Set-Location -Path "sanjeevani-frontend"
    npm run build
    Set-Location -Path ".."
    
    if (-not (Test-Path -Path "sanjeevani-frontend/build")) {
        Write-Host "Failed to build the application. Exiting..." -ForegroundColor Red
        exit 1
    }
}

# Create a deployment package
Write-Host "Creating deployment package..." -ForegroundColor Green
if (Test-Path -Path "sanjeevani-deployment.zip") {
    Remove-Item -Path "sanjeevani-deployment.zip" -Force
}

Compress-Archive -Path "sanjeevani-frontend/build/*" -DestinationPath "sanjeevani-deployment.zip" -Force

Write-Host "Deployment package created: sanjeevani-deployment.zip" -ForegroundColor Green
Write-Host ""

# Deployment instructions
Write-Host "=== Deployment Instructions ===" -ForegroundColor Blue
Write-Host "To deploy to Netlify, follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to https://app.netlify.com/drop" -ForegroundColor Cyan
Write-Host "2. Drag and drop the 'sanjeevani-deployment.zip' file onto the page" -ForegroundColor Cyan
Write-Host "3. Wait for the deployment to complete" -ForegroundColor Cyan
Write-Host "4. Your site will be available at a Netlify subdomain" -ForegroundColor Cyan
Write-Host ""
Write-Host "For a custom domain, go to Site settings > Domain management > Add custom domain" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
