# Sanjeevani 2.0 Docker Deployment Script
Write-Host "=== Sanjeevani 2.0 Docker Deployment Script ===" -ForegroundColor Blue
Write-Host "This script will deploy the Sanjeevani 2.0 application using Docker." -ForegroundColor Yellow
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker and try again." -ForegroundColor Red
    Write-Host "Download Docker from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if nginx directory exists
if (-not (Test-Path -Path "sanjeevani-frontend/nginx")) {
    Write-Host "Creating nginx configuration directory..." -ForegroundColor Yellow
    New-Item -Path "sanjeevani-frontend/nginx" -ItemType Directory -Force | Out-Null
    
    # Create nginx.conf
    @"
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self';";

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
"@ | Out-File -FilePath "sanjeevani-frontend/nginx/nginx.conf" -Encoding utf8
}

# Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Green
Set-Location -Path "sanjeevani-frontend"
docker build -t sanjeevani-frontend:latest .

# Check if build was successful
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build Docker image. Exiting..." -ForegroundColor Red
    exit 1
}

# Run Docker container
Write-Host "Running Docker container..." -ForegroundColor Green
docker run -d -p 8080:80 --name sanjeevani-frontend sanjeevani-frontend:latest

# Check if container is running
$container = docker ps -f "name=sanjeevani-frontend" --format "{{.Names}}"
if ($container -eq "sanjeevani-frontend") {
    Write-Host "Docker container is running successfully!" -ForegroundColor Green
    Write-Host "You can access the application at: http://localhost:8080" -ForegroundColor Cyan
} else {
    Write-Host "Failed to start Docker container. Please check Docker logs." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host "To stop the container, run: docker stop sanjeevani-frontend" -ForegroundColor Yellow
Write-Host "To remove the container, run: docker rm sanjeevani-frontend" -ForegroundColor Yellow
