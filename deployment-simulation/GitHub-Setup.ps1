# Sanjeevani 2.0 GitHub Repository Setup Script for Windows
# This script helps set up a GitHub repository for Sanjeevani 2.0

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 GitHub Repository Setup Script ===" -ForegroundColor $Blue
Write-Host "This script will help you set up a GitHub repository for Sanjeevani 2.0." -ForegroundColor $Yellow
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

# Check if git is installed
if (-not (Test-CommandExists git)) {
    Write-Host "Error: git is not installed. Please install git first." -ForegroundColor $Red
    exit 1
}

# Get GitHub username
$GitHubUsername = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrEmpty($GitHubUsername)) {
    Write-Host "Error: GitHub username cannot be empty." -ForegroundColor $Red
    exit 1
}

# Get repository name
$RepoName = Read-Host "Enter repository name (default: sanjeevani-2.0)"
if ([string]::IsNullOrEmpty($RepoName)) {
    $RepoName = "sanjeevani-2.0"
}

# Check if .git directory already exists
if (Test-Path ".git") {
    Write-Host "A git repository already exists in this directory." -ForegroundColor $Yellow
    $UseExisting = Read-Host "Do you want to continue and use the existing repository? (y/n)"
    if ($UseExisting -ne "y") {
        Write-Host "Exiting script. Please run in a directory without an existing git repository." -ForegroundColor $Yellow
        exit 0
    }
} else {
    # Initialize git repository
    Write-Host "Initializing git repository..." -ForegroundColor $Green
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to initialize git repository." -ForegroundColor $Red
        exit 1
    }
}

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..." -ForegroundColor $Green
    $GitIgnoreContent = @"
# Dependencies
node_modules/
venv/
__pycache__/
.pytest_cache/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
firebase-credentials.json
firebase-debug.log
firebase-debug.*.log
.firebase/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Testing
coverage/
.coverage
htmlcov/
.nyc_output/

# Production build
build/
dist/

# IDE and editors
.idea/
.vscode/
*.swp
*.swo
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
*.sublime-project
*.sublime-workspace

# Misc
.DS_Store
Thumbs.db
.cache/
.project
.settings/
.tmproj
*.esproj
nbproject/
*.launch
*.iml
*.ipr
*.iws
.idea/
.vscode/
*.sw?

# MongoDB
data/db/

# Netlify
.netlify/

# Render
.render/
"@
    Set-Content -Path ".gitignore" -Value $GitIgnoreContent
}

# Add all files to git
Write-Host "Adding files to git..." -ForegroundColor $Green
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add files to git." -ForegroundColor $Red
    exit 1
}

# Commit changes
Write-Host "Committing changes..." -ForegroundColor $Green
git commit -m "Initial commit: Sanjeevani 2.0 healthcare platform"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to commit changes." -ForegroundColor $Red
    exit 1
}

# Create GitHub repository
Write-Host "Now you need to create a repository on GitHub:" -ForegroundColor $Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor $Blue
Write-Host "2. Enter '$RepoName' as the repository name" -ForegroundColor $Blue
Write-Host "3. Add a description: 'A comprehensive healthcare platform with multilingual support and advanced features'" -ForegroundColor $Blue
Write-Host "4. Choose 'Public' or 'Private' visibility based on your needs" -ForegroundColor $Blue
Write-Host "5. Do NOT initialize with README, .gitignore, or license (we already have these)" -ForegroundColor $Blue
Write-Host "6. Click 'Create repository'" -ForegroundColor $Blue
Write-Host ""
$CreatedRepo = Read-Host "Have you created the repository on GitHub? (y/n)"
if ($CreatedRepo -ne "y") {
    Write-Host "Please create the repository before continuing." -ForegroundColor $Yellow
    exit 0
}

# Add remote origin
Write-Host "Adding remote origin..." -ForegroundColor $Green
git remote add origin "https://github.com/$GitHubUsername/$RepoName.git"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to add remote origin." -ForegroundColor $Red
    exit 1
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor $Green
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push to 'main' branch. Trying 'master' branch..." -ForegroundColor $Yellow
    git push -u origin master
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor $Red
        exit 1
    }
}

Write-Host ""
Write-Host "Success! Your code has been pushed to GitHub." -ForegroundColor $Green
Write-Host "Next steps:" -ForegroundColor $Blue
Write-Host "1. Set up GitHub Secrets for CI/CD (see deployment-summary.html for details)" -ForegroundColor $Blue
Write-Host "2. Connect your repository to Netlify and Render" -ForegroundColor $Blue
Write-Host "3. Push changes to trigger the CI/CD pipeline" -ForegroundColor $Blue
Write-Host ""
Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor $Yellow
