#!/bin/bash

# Sanjeevani 2.0 One-Line Deploy Script
# This script handles the entire deployment process for Sanjeevani 2.0

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to display progress
progress() {
    echo -e "${BLUE}[$1/${TOTAL_STEPS}] ${GREEN}$2${NC}"
}

# Function to display error and exit
error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Function to prompt for confirmation
confirm() {
    read -p "$1 (y/n): " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

echo -e "${BLUE}=== Sanjeevani 2.0 One-Line Deploy Script ===${NC}"
echo -e "${YELLOW}This script will deploy Sanjeevani 2.0 to production.${NC}"
echo

# Check for required tools
echo -e "${YELLOW}Checking for required tools...${NC}"
MISSING_TOOLS=()

if ! command_exists git; then
    MISSING_TOOLS+=("git")
fi

if ! command_exists node; then
    MISSING_TOOLS+=("node")
fi

if ! command_exists npm; then
    MISSING_TOOLS+=("npm")
fi

if ! command_exists python3; then
    MISSING_TOOLS+=("python3")
fi

if ! command_exists pip; then
    MISSING_TOOLS+=("pip")
fi

if ! command_exists zip; then
    MISSING_TOOLS+=("zip")
fi

if ! command_exists gh; then
    MISSING_TOOLS+=("gh (GitHub CLI)")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    echo -e "${RED}The following required tools are missing:${NC}"
    for tool in "${MISSING_TOOLS[@]}"; do
        echo -e "  - $tool"
    done
    echo -e "${YELLOW}Please install these tools and try again.${NC}"
    exit 1
fi

# Set total steps
TOTAL_STEPS=10

# Step 1: Get GitHub information
progress 1 "Setting up GitHub repository"
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    error "GitHub username cannot be empty."
fi

read -p "Enter repository name (default: sanjeevani-2.0): " REPO_NAME
REPO_NAME=${REPO_NAME:-sanjeevani-2.0}

# Step 2: Create deployment package
progress 2 "Creating deployment package"
if [ -f "create-deployment-package.sh" ]; then
    chmod +x create-deployment-package.sh
    ./create-deployment-package.sh || error "Failed to create deployment package."
else
    error "create-deployment-package.sh not found."
fi

# Step 3: Extract deployment package
progress 3 "Extracting deployment package"
if [ -f "sanjeevani-deployment-package.zip" ]; then
    unzip -q sanjeevani-deployment-package.zip || error "Failed to extract deployment package."
else
    error "sanjeevani-deployment-package.zip not found."
fi

# Step 4: Set up GitHub repository
progress 4 "Setting up GitHub repository"
cd deployment-package || error "Failed to change directory to deployment-package."
chmod +x setup-github.sh
./setup-github.sh || error "Failed to set up GitHub repository."

# Step 5: Set up GitHub Secrets
progress 5 "Setting up GitHub Secrets"
chmod +x setup-github-secrets.sh
./setup-github-secrets.sh || error "Failed to set up GitHub Secrets."

# Step 6: Validate GitHub Actions workflows
progress 6 "Validating GitHub Actions workflows"
chmod +x validate-workflows.sh
./validate-workflows.sh || error "Failed to validate GitHub Actions workflows."

# Step 7: Set up Netlify
progress 7 "Setting up Netlify"
echo -e "${YELLOW}Please set up Netlify manually:${NC}"
echo -e "1. Go to ${BLUE}https://app.netlify.com/start${NC}"
echo -e "2. Select 'GitHub' as your Git provider"
echo -e "3. Select your '$REPO_NAME' repository"
echo -e "4. Configure the build settings:"
echo -e "   - Base directory: sanjeevani-frontend"
echo -e "   - Build command: npm run build"
echo -e "   - Publish directory: sanjeevani-frontend/build"
echo -e "5. Click 'Deploy site'"
if ! confirm "Have you set up Netlify?"; then
    echo -e "${YELLOW}Please set up Netlify before continuing.${NC}"
    exit 0
fi

# Step 8: Set up Render
progress 8 "Setting up Render"
echo -e "${YELLOW}Please set up Render manually:${NC}"
echo -e "1. Go to ${BLUE}https://dashboard.render.com/new/web-service${NC}"
echo -e "2. Select your '$REPO_NAME' repository"
echo -e "3. Configure the service:"
echo -e "   - Name: sanjeevani-api"
echo -e "   - Root Directory: sanjeevani-backend"
echo -e "   - Runtime: Python 3"
echo -e "   - Build Command: pip install -r requirements.txt"
echo -e "   - Start Command: uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
echo -e "4. Add environment variables from env-templates/backend.env.production"
echo -e "5. Click 'Create Web Service'"
if ! confirm "Have you set up Render?"; then
    echo -e "${YELLOW}Please set up Render before continuing.${NC}"
    exit 0
fi

# Step 9: Trigger CI/CD pipeline
progress 9 "Triggering CI/CD pipeline"
echo -e "${YELLOW}Pushing changes to trigger CI/CD pipeline...${NC}"
git add .
git commit -m "Update configuration for deployment"
git push origin main || error "Failed to push changes."

# Step 10: Verify deployment
progress 10 "Verifying deployment"
echo -e "${YELLOW}Please verify the deployment:${NC}"
echo -e "1. Check GitHub Actions workflows: ${BLUE}https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions${NC}"
echo -e "2. Check Netlify deployment: ${BLUE}https://app.netlify.com/sites/${NC}"
echo -e "3. Check Render deployment: ${BLUE}https://dashboard.render.com/web/${NC}"
echo -e "4. Visit your deployed frontend application"
echo -e "5. Test the API endpoints"

echo
echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Monitor the application for any issues"
echo -e "2. Set up monitoring and alerting"
echo -e "3. Configure custom domains"
echo -e "4. Set up SSL certificates"
echo
echo -e "${YELLOW}For more information, refer to the documentation:${NC}"
echo -e "- DEPLOYMENT.md"
echo -e "- MONITORING.md"
echo -e "- SECURITY.md"
echo
