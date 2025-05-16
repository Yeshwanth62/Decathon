# Sanjeevani 2.0 Deployment Script for Windows
# This script automates the deployment of Sanjeevani 2.0

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 Deployment Script ===" -ForegroundColor $Blue
Write-Host "This script will deploy Sanjeevani 2.0 to production." -ForegroundColor $Yellow
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

# Function to display progress
function Write-Progress {
    param (
        [int]$Step,
        [string]$Message
    )
    Write-Host "[$Step/$TotalSteps] $Message" -ForegroundColor $Green
}

# Set total steps
$TotalSteps = 10

# Check for required tools
Write-Host "Checking for required tools..." -ForegroundColor $Yellow
$MissingTools = @()

if (-not (Test-CommandExists git)) {
    $MissingTools += "git"
}

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

# Step 1: Get GitHub information
Write-Progress -Step 1 -Message "Setting up GitHub repository"
$GitHubUsername = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "Error: GitHub username cannot be empty." -ForegroundColor $Red
    exit 1
}

$RepoName = Read-Host "Enter repository name (default: sanjeevani-2.0)"
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = "sanjeevani-2.0"
}

# Step 2: Initialize Git repository
Write-Progress -Step 2 -Message "Initializing Git repository"
if (Test-Path ".git") {
    Write-Host "Git repository already initialized." -ForegroundColor $Yellow
} else {
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to initialize Git repository." -ForegroundColor $Red
        exit 1
    }
}

# Step 3: Create GitHub repository
Write-Progress -Step 3 -Message "Creating GitHub repository"
Write-Host "Please create a repository on GitHub:" -ForegroundColor $Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor $Blue
Write-Host "2. Enter '$RepoName' as the repository name" -ForegroundColor $Blue
Write-Host "3. Add a description: 'Sanjeevani 2.0 - A comprehensive healthcare platform with multilingual support and advanced features'" -ForegroundColor $Blue
Write-Host "4. Choose 'Private' visibility" -ForegroundColor $Blue
Write-Host "5. Do NOT initialize with README, .gitignore, or license" -ForegroundColor $Blue
Write-Host "6. Click 'Create repository'" -ForegroundColor $Blue
Write-Host ""
$CreatedRepo = Read-Host "Have you created the repository on GitHub? (y/n)"
if ($CreatedRepo -ne "y") {
    Write-Host "Please create the repository before continuing." -ForegroundColor $Yellow
    exit 0
}

# Step 4: Add remote origin
Write-Progress -Step 4 -Message "Adding remote origin"
git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add remote origin." -ForegroundColor $Red
    exit 1
}

# Step 5: Add files to Git
Write-Progress -Step 5 -Message "Adding files to Git"
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add files to Git." -ForegroundColor $Red
    exit 1
}

# Step 6: Commit changes
Write-Progress -Step 6 -Message "Committing changes"
git commit -m "Initial commit: Sanjeevani 2.0 healthcare platform"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to commit changes." -ForegroundColor $Red
    exit 1
}

# Step 7: Push to GitHub
Write-Progress -Step 7 -Message "Pushing to GitHub"
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to 'main' branch. Trying 'master' branch..." -ForegroundColor $Yellow
    git push -u origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor $Red
        exit 1
    }
}

# Step 8: Set up Netlify
Write-Progress -Step 8 -Message "Setting up Netlify"
Write-Host "Please set up Netlify manually:" -ForegroundColor $Yellow
Write-Host "1. Go to https://app.netlify.com/start" -ForegroundColor $Blue
Write-Host "2. Select 'GitHub' as your Git provider" -ForegroundColor $Blue
Write-Host "3. Select your '$RepoName' repository" -ForegroundColor $Blue
Write-Host "4. Configure the build settings:" -ForegroundColor $Blue
Write-Host "   - Base directory: sanjeevani-frontend" -ForegroundColor $Blue
Write-Host "   - Build command: npm run build" -ForegroundColor $Blue
Write-Host "   - Publish directory: sanjeevani-frontend/build" -ForegroundColor $Blue
Write-Host "5. Click 'Deploy site'" -ForegroundColor $Blue
$SetupNetlify = Read-Host "Have you set up Netlify? (y/n)"
if ($SetupNetlify -ne "y") {
    Write-Host "Please set up Netlify before continuing." -ForegroundColor $Yellow
    exit 0
}

# Step 9: Set up Render
Write-Progress -Step 9 -Message "Setting up Render"
Write-Host "Please set up Render manually:" -ForegroundColor $Yellow
Write-Host "1. Go to https://dashboard.render.com/new/web-service" -ForegroundColor $Blue
Write-Host "2. Select your '$RepoName' repository" -ForegroundColor $Blue
Write-Host "3. Configure the service:" -ForegroundColor $Blue
Write-Host "   - Name: sanjeevani-api" -ForegroundColor $Blue
Write-Host "   - Root Directory: sanjeevani-backend" -ForegroundColor $Blue
Write-Host "   - Runtime: Python 3" -ForegroundColor $Blue
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor $Blue
Write-Host "   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port `$PORT" -ForegroundColor $Blue
Write-Host "4. Add environment variables from env-templates/backend.env.production" -ForegroundColor $Blue
Write-Host "5. Click 'Create Web Service'" -ForegroundColor $Blue
$SetupRender = Read-Host "Have you set up Render? (y/n)"
if ($SetupRender -ne "y") {
    Write-Host "Please set up Render before continuing." -ForegroundColor $Yellow
    exit 0
}

# Step 10: Verify deployment
Write-Progress -Step 10 -Message "Verifying deployment"
Write-Host "Please verify the deployment:" -ForegroundColor $Yellow
Write-Host "1. Check GitHub Actions workflows: https://github.com/$GitHubUsername/$RepoName/actions" -ForegroundColor $Blue
Write-Host "2. Check Netlify deployment: https://app.netlify.com/sites/" -ForegroundColor $Blue
Write-Host "3. Check Render deployment: https://dashboard.render.com/web/" -ForegroundColor $Blue
Write-Host "4. Visit your deployed frontend application" -ForegroundColor $Blue
Write-Host "5. Test the API endpoints" -ForegroundColor $Blue

Write-Host ""
Write-Host "Deployment process completed!" -ForegroundColor $Green
Write-Host "Next steps:" -ForegroundColor $Blue
Write-Host "1. Monitor the application for any issues" -ForegroundColor $Blue
Write-Host "2. Set up monitoring and alerting" -ForegroundColor $Blue
Write-Host "3. Configure custom domains" -ForegroundColor $Blue
Write-Host "4. Set up SSL certificates" -ForegroundColor $Blue
Write-Host ""
Write-Host "For more information, refer to the documentation:" -ForegroundColor $Yellow
Write-Host "- DEPLOYMENT.md" -ForegroundColor $Yellow
Write-Host "- MONITORING.md" -ForegroundColor $Yellow
Write-Host "- SECURITY.md" -ForegroundColor $Yellow
