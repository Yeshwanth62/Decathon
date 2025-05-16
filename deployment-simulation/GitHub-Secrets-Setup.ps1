# Sanjeevani 2.0 GitHub Secrets Setup Script for Windows
# This script helps set up GitHub secrets for Sanjeevani 2.0 CI/CD

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 GitHub Secrets Setup Script ===" -ForegroundColor $Blue
Write-Host "This script will help you set up GitHub secrets for CI/CD." -ForegroundColor $Yellow
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

# Check if gh CLI is installed
if (-not (Test-CommandExists gh)) {
    Write-Host "Error: GitHub CLI (gh) is not installed." -ForegroundColor $Red
    Write-Host "Please install it from: https://cli.github.com/" -ForegroundColor $Yellow
    exit 1
}

# Check if logged in to GitHub CLI
gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to GitHub CLI." -ForegroundColor $Yellow
    gh auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to log in to GitHub CLI." -ForegroundColor $Red
        exit 1
    }
}

# Get repository information
$GitHubUsername = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "Error: GitHub username cannot be empty." -ForegroundColor $Red
    exit 1
}

$RepoName = Read-Host "Enter repository name (default: sanjeevani-2.0)"
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = "sanjeevani-2.0"
}

# Verify repository exists
gh repo view "$GitHubUsername/$RepoName" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Repository $GitHubUsername/$RepoName not found." -ForegroundColor $Red
    exit 1
}

Write-Host "Setting up secrets for $GitHubUsername/$RepoName..." -ForegroundColor $Green
Write-Host ""

# Frontend secrets
Write-Host "Frontend Secrets" -ForegroundColor $Blue
Write-Host "These secrets are used by the frontend CI/CD pipeline." -ForegroundColor $Yellow
Write-Host ""

# Firebase configuration
Write-Host "Firebase Configuration" -ForegroundColor $Yellow
$FirebaseApiKey = Read-Host "Enter Firebase API Key"
$FirebaseAuthDomain = Read-Host "Enter Firebase Auth Domain"
$FirebaseProjectId = Read-Host "Enter Firebase Project ID"
$FirebaseStorageBucket = Read-Host "Enter Firebase Storage Bucket"
$FirebaseMessagingSenderId = Read-Host "Enter Firebase Messaging Sender ID"
$FirebaseAppId = Read-Host "Enter Firebase App ID"

# Google Maps configuration
Write-Host "Google Maps Configuration" -ForegroundColor $Yellow
$GoogleMapsApiKey = Read-Host "Enter Google Maps API Key"

# Analytics configuration
Write-Host "Analytics Configuration" -ForegroundColor $Yellow
$GaTrackingId = Read-Host "Enter Google Analytics Tracking ID"

# Error tracking configuration
Write-Host "Error Tracking Configuration" -ForegroundColor $Yellow
$SentryDsn = Read-Host "Enter Sentry DSN"

# Netlify configuration
Write-Host "Netlify Configuration" -ForegroundColor $Yellow
$NetlifyAuthToken = Read-Host "Enter Netlify Auth Token"
$NetlifySiteId = Read-Host "Enter Netlify Site ID"

# Backend secrets
Write-Host "Backend Secrets" -ForegroundColor $Blue
Write-Host "These secrets are used by the backend CI/CD pipeline." -ForegroundColor $Yellow
Write-Host ""

# MongoDB configuration
Write-Host "MongoDB Configuration" -ForegroundColor $Yellow
$MongoDbUrl = Read-Host "Enter MongoDB URL"
$MongoDbDbName = Read-Host "Enter MongoDB Database Name"

# JWT configuration
Write-Host "JWT Configuration" -ForegroundColor $Yellow
$JwtSecretKey = Read-Host "Enter JWT Secret Key"
$JwtAlgorithm = Read-Host "Enter JWT Algorithm (default: HS256)"
if ([string]::IsNullOrEmpty($JwtAlgorithm)) {
    $JwtAlgorithm = "HS256"
}
$JwtAccessTokenExpireMinutes = Read-Host "Enter JWT Access Token Expire Minutes (default: 60)"
if ([string]::IsNullOrEmpty($JwtAccessTokenExpireMinutes)) {
    $JwtAccessTokenExpireMinutes = "60"
}
$JwtRefreshTokenExpireDays = Read-Host "Enter JWT Refresh Token Expire Days (default: 7)"
if ([string]::IsNullOrEmpty($JwtRefreshTokenExpireDays)) {
    $JwtRefreshTokenExpireDays = "7"
}

# Firebase credentials
Write-Host "Firebase Credentials (JSON)" -ForegroundColor $Yellow
Write-Host "Enter the path to your Firebase credentials JSON file:" -ForegroundColor $Yellow
$FirebaseCredentialsPath = Read-Host "Path"
if (-not (Test-Path $FirebaseCredentialsPath)) {
    Write-Host "Error: Firebase credentials file not found." -ForegroundColor $Red
    exit 1
}
$FirebaseCredentials = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content $FirebaseCredentialsPath -Raw)))

# Twilio configuration
Write-Host "Twilio Configuration" -ForegroundColor $Yellow
$TwilioAccountSid = Read-Host "Enter Twilio Account SID"
$TwilioAuthToken = Read-Host "Enter Twilio Auth Token"
$TwilioPhoneNumber = Read-Host "Enter Twilio Phone Number"

# Render configuration
Write-Host "Render Configuration" -ForegroundColor $Yellow
$RenderToken = Read-Host "Enter Render Token"

# Set GitHub secrets
Write-Host "Setting GitHub secrets..." -ForegroundColor $Green

# Frontend secrets
gh secret set REACT_APP_FIREBASE_API_KEY --body "$FirebaseApiKey" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_FIREBASE_AUTH_DOMAIN --body "$FirebaseAuthDomain" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_FIREBASE_PROJECT_ID --body "$FirebaseProjectId" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_FIREBASE_STORAGE_BUCKET --body "$FirebaseStorageBucket" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_FIREBASE_MESSAGING_SENDER_ID --body "$FirebaseMessagingSenderId" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_FIREBASE_APP_ID --body "$FirebaseAppId" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_GOOGLE_MAPS_API_KEY --body "$GoogleMapsApiKey" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_GA_TRACKING_ID --body "$GaTrackingId" --repo "$GitHubUsername/$RepoName"
gh secret set REACT_APP_SENTRY_DSN --body "$SentryDsn" --repo "$GitHubUsername/$RepoName"
gh secret set NETLIFY_AUTH_TOKEN --body "$NetlifyAuthToken" --repo "$GitHubUsername/$RepoName"
gh secret set NETLIFY_SITE_ID --body "$NetlifySiteId" --repo "$GitHubUsername/$RepoName"

# Backend secrets
gh secret set MONGODB_URL --body "$MongoDbUrl" --repo "$GitHubUsername/$RepoName"
gh secret set MONGODB_DB_NAME --body "$MongoDbDbName" --repo "$GitHubUsername/$RepoName"
gh secret set JWT_SECRET_KEY --body "$JwtSecretKey" --repo "$GitHubUsername/$RepoName"
gh secret set JWT_ALGORITHM --body "$JwtAlgorithm" --repo "$GitHubUsername/$RepoName"
gh secret set JWT_ACCESS_TOKEN_EXPIRE_MINUTES --body "$JwtAccessTokenExpireMinutes" --repo "$GitHubUsername/$RepoName"
gh secret set JWT_REFRESH_TOKEN_EXPIRE_DAYS --body "$JwtRefreshTokenExpireDays" --repo "$GitHubUsername/$RepoName"
gh secret set FIREBASE_CREDENTIALS --body "$FirebaseCredentials" --repo "$GitHubUsername/$RepoName"
gh secret set TWILIO_ACCOUNT_SID --body "$TwilioAccountSid" --repo "$GitHubUsername/$RepoName"
gh secret set TWILIO_AUTH_TOKEN --body "$TwilioAuthToken" --repo "$GitHubUsername/$RepoName"
gh secret set TWILIO_PHONE_NUMBER --body "$TwilioPhoneNumber" --repo "$GitHubUsername/$RepoName"
gh secret set GOOGLE_MAPS_API_KEY --body "$GoogleMapsApiKey" --repo "$GitHubUsername/$RepoName"
gh secret set SENTRY_DSN --body "$SentryDsn" --repo "$GitHubUsername/$RepoName"
gh secret set RENDER_TOKEN --body "$RenderToken" --repo "$GitHubUsername/$RepoName"

Write-Host ""
Write-Host "Success! GitHub secrets have been set up for $GitHubUsername/$RepoName." -ForegroundColor $Green
Write-Host "Next steps:" -ForegroundColor $Blue
Write-Host "1. Connect your repository to Netlify and Render" -ForegroundColor $Blue
Write-Host "2. Push changes to trigger the CI/CD pipeline" -ForegroundColor $Blue
Write-Host ""
Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor $Yellow
