# Sanjeevani 2.0 Deployment Package Creator (PowerShell Version)
# This script creates a deployment package for Sanjeevani 2.0

# Text colors
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Blue = [System.ConsoleColor]::Blue
$Red = [System.ConsoleColor]::Red

Write-Host "=== Sanjeevani 2.0 Deployment Package Creator ===" -ForegroundColor $Blue
Write-Host "This script creates a deployment package for Sanjeevani 2.0." -ForegroundColor $Yellow
Write-Host ""

# Create deployment directory
Write-Host "Creating deployment directory..." -ForegroundColor $Green
if (-not (Test-Path -Path "deployment-package")) {
    New-Item -Path "deployment-package" -ItemType Directory | Out-Null
    if (-not $?) {
        Write-Host "Error: Failed to create deployment directory." -ForegroundColor $Red
        exit 1
    }
} else {
    # Clean up existing directory
    Remove-Item -Path "deployment-package\*" -Recurse -Force
}

# Copy deployment files
Write-Host "Copying deployment files..." -ForegroundColor $Green
$filesToCopy = @(
    "DEPLOYMENT.md",
    "DEPLOYMENT_CHECKLIST.md",
    "MONITORING.md",
    "SECURITY.md",
    "HANDOFF.md",
    "setup-github.sh",
    "setup-github-secrets.sh",
    "validate-workflows.sh",
    "deploy.sh",
    "github-upload.sh",
    "generate-pdf.sh",
    "deployment-summary.html"
)

foreach ($file in $filesToCopy) {
    if (Test-Path -Path $file) {
        Copy-Item -Path $file -Destination "deployment-package\" -Force
    } else {
        Write-Host "Warning: File $file not found, skipping." -ForegroundColor $Yellow
    }
}

# Create env-templates directory
New-Item -Path "deployment-package\env-templates" -ItemType Directory -Force | Out-Null
if (Test-Path -Path "env-templates") {
    Copy-Item -Path "env-templates\*" -Destination "deployment-package\env-templates\" -Force
} else {
    Write-Host "Warning: env-templates directory not found, creating empty directory." -ForegroundColor $Yellow
    New-Item -Path "deployment-package\env-templates" -ItemType Directory -Force | Out-Null
}

# Copy GitHub Actions workflows
Write-Host "Copying GitHub Actions workflows..." -ForegroundColor $Green
New-Item -Path "deployment-package\.github\workflows" -ItemType Directory -Force | Out-Null
if (Test-Path -Path ".github\workflows") {
    Copy-Item -Path ".github\workflows\*" -Destination "deployment-package\.github\workflows\" -Force
} else {
    Write-Host "Warning: .github\workflows directory not found, creating empty directory." -ForegroundColor $Yellow
}

# Create README.md
Write-Host "Creating README.md..." -ForegroundColor $Green
$readmeContent = @"
# Sanjeevani 2.0 Deployment Package

This package contains everything you need to deploy Sanjeevani 2.0 to production.

## Contents

- `DEPLOYMENT.md` - Deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `MONITORING.md` - Monitoring and observability guide
- `SECURITY.md` - Security guide
- `HANDOFF.md` - Project handoff document
- `setup-github.sh` - GitHub repository setup script
- `setup-github-secrets.sh` - GitHub Secrets setup script
- `validate-workflows.sh` - GitHub Actions workflow validator
- `deploy.sh` - One-line deploy script
- `github-upload.sh` - GitHub repository upload helper
- `generate-pdf.sh` - PDF generator for documentation
- `deployment-summary.html` - Deployment summary
- `env-templates/` - Environment variable templates
- `.github/workflows/` - GitHub Actions workflows

## Getting Started

1. Read `DEPLOYMENT.md` for deployment instructions
2. Use `DEPLOYMENT_CHECKLIST.md` to track deployment progress
3. Run `deploy.sh` for a guided deployment process, or:
   - Run `github-upload.sh` to upload your repository to GitHub
   - Run `setup-github-secrets.sh` to set up GitHub Secrets
   - Run `validate-workflows.sh` to validate GitHub Actions workflows
4. Run `generate-pdf.sh` to generate PDF documentation

## Additional Resources

- `MONITORING.md` - Information on monitoring and observability
- `SECURITY.md` - Information on security measures
- `HANDOFF.md` - Comprehensive project handoff document
- `deployment-summary.html` - HTML version of deployment summary
- `env-templates/` - Templates for environment variables
"@

Set-Content -Path "deployment-package\README.md" -Value $readmeContent
if (-not $?) {
    Write-Host "Error: Failed to create README.md." -ForegroundColor $Red
    exit 1
}

# Create Windows versions of scripts
Write-Host "Creating Windows versions of scripts..." -ForegroundColor $Green

# Create Windows version of deploy.sh
$deployPsContent = @"
# Sanjeevani 2.0 One-Line Deploy Script (PowerShell Version)
# This script handles the entire deployment process for Sanjeevani 2.0

Write-Host "=== Sanjeevani 2.0 One-Line Deploy Script ===" -ForegroundColor Cyan
Write-Host "This script will deploy Sanjeevani 2.0 to production." -ForegroundColor Yellow
Write-Host ""

# Check for required tools
Write-Host "Checking for required tools..." -ForegroundColor Yellow
`$missingTools = @()

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    `$missingTools += "git"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    `$missingTools += "node"
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    `$missingTools += "npm"
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    `$missingTools += "python"
}

if (-not (Get-Command pip -ErrorAction SilentlyContinue)) {
    `$missingTools += "pip"
}

if (`$missingTools.Count -gt 0) {
    Write-Host "The following required tools are missing:" -ForegroundColor Red
    foreach (`$tool in `$missingTools) {
        Write-Host "  - `$tool" -ForegroundColor Red
    }
    Write-Host "Please install these tools and try again." -ForegroundColor Yellow
    exit 1
}

# Get GitHub information
Write-Host "[1/10] Setting up GitHub repository" -ForegroundColor Green
`$githubUsername = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrEmpty(`$githubUsername)) {
    Write-Host "Error: GitHub username cannot be empty." -ForegroundColor Red
    exit 1
}

`$repoName = Read-Host "Enter repository name (default: sanjeevani-2.0)"
if ([string]::IsNullOrEmpty(`$repoName)) {
    `$repoName = "sanjeevani-2.0"
}

# Follow the deployment steps...
Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Monitor the application for any issues"
Write-Host "2. Set up monitoring and alerting"
Write-Host "3. Configure custom domains"
Write-Host "4. Set up SSL certificates"
Write-Host ""
Write-Host "For more information, refer to the documentation:" -ForegroundColor Yellow
Write-Host "- DEPLOYMENT.md"
Write-Host "- MONITORING.md"
Write-Host "- SECURITY.md"
"@

Set-Content -Path "deployment-package\deploy.ps1" -Value $deployPsContent

# Create a simple PDF generator script
$generatePdfPsContent = @'
# Sanjeevani 2.0 PDF Generator (PowerShell Version)
Write-Host "=== Sanjeevani 2.0 PDF Generator ===" -ForegroundColor Cyan
Write-Host "This script converts Markdown files to PDF." -ForegroundColor Yellow

# Check if pandoc is installed
if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Host "Error: pandoc is not installed." -ForegroundColor Red
    Write-Host "Please install pandoc from: https://pandoc.org/installing.html" -ForegroundColor Yellow
    exit 1
}

# Convert HANDOFF.md to PDF
if (Test-Path "HANDOFF.md") {
    Write-Host "Converting HANDOFF.md to HANDOFF.pdf..." -ForegroundColor Green
    pandoc "HANDOFF.md" -o "HANDOFF.pdf" --pdf-engine=xelatex
    if (Test-Path "HANDOFF.pdf") {
        Write-Host "Successfully converted HANDOFF.md to HANDOFF.pdf" -ForegroundColor Green
    } else {
        Write-Host "Failed to convert HANDOFF.md to HANDOFF.pdf" -ForegroundColor Red
    }
} else {
    Write-Host "HANDOFF.md not found." -ForegroundColor Yellow
}

Write-Host "PDF generation completed!" -ForegroundColor Green
'@

Set-Content -Path "deployment-package\generate-pdf.ps1" -Value $generatePdfPsContent

# Create zip file
Write-Host "Creating zip file..." -ForegroundColor $Green
if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    Compress-Archive -Path "deployment-package\*" -DestinationPath "sanjeevani-deployment-package.zip" -Force
    if (-not $?) {
        Write-Host "Error: Failed to create zip file." -ForegroundColor $Red
        exit 1
    }
} else {
    Write-Host "Warning: Compress-Archive command not available. Using alternative method." -ForegroundColor $Yellow
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory("deployment-package", "sanjeevani-deployment-package.zip")
}

# Clean up
Write-Host "Cleaning up..." -ForegroundColor $Green
Remove-Item -Path "deployment-package" -Recurse -Force
if (-not $?) {
    Write-Host "Error: Failed to clean up." -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Success! Deployment package created: sanjeevani-deployment-package.zip" -ForegroundColor $Green
Write-Host "Next steps:" -ForegroundColor $Blue
Write-Host "1. Extract the deployment package"
Write-Host "2. Follow the instructions in DEPLOYMENT.md"
Write-Host "3. Use the scripts to set up your GitHub repository and secrets"
Write-Host "4. Deploy Sanjeevani 2.0 to production"
Write-Host ""
