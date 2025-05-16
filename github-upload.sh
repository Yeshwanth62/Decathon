#!/bin/bash

# Sanjeevani 2.0 GitHub Repository Upload Helper
# This script helps upload the Sanjeevani 2.0 repository to GitHub

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 GitHub Repository Upload Helper ===${NC}"
echo -e "${YELLOW}This script will help you upload the Sanjeevani 2.0 repository to GitHub.${NC}"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    HAS_GH_CLI=true
    # Check if logged in
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}You need to log in to GitHub CLI.${NC}"
        gh auth login
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to log in to GitHub CLI.${NC}"
            HAS_GH_CLI=false
        fi
    fi
else
    HAS_GH_CLI=false
    echo -e "${YELLOW}GitHub CLI (gh) is not installed. We'll use the web interface instead.${NC}"
fi

# Get GitHub username
read -p "Enter your GitHub username: " github_username
if [ -z "$github_username" ]; then
    echo -e "${RED}Error: GitHub username cannot be empty.${NC}"
    exit 1
fi

# Get repository name
read -p "Enter repository name (default: sanjeevani-2.0): " repo_name
repo_name=${repo_name:-sanjeevani-2.0}

# Get repository visibility
read -p "Make repository public? (y/n, default: n): " make_public
make_public=${make_public:-n}
if [[ "$make_public" == "y" || "$make_public" == "Y" ]]; then
    visibility="public"
else
    visibility="private"
fi

# Create GitHub repository
echo -e "${GREEN}Creating GitHub repository...${NC}"
if [ "$HAS_GH_CLI" = true ]; then
    # Create repository using GitHub CLI
    gh repo create "$github_username/$repo_name" --$visibility --description "Sanjeevani 2.0 - A comprehensive healthcare platform with multilingual support and advanced features" --source=. --remote=origin
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to create GitHub repository.${NC}"
        exit 1
    fi
else
    # Create repository using web interface
    echo -e "${YELLOW}Please create a repository on GitHub:${NC}"
    echo -e "1. Go to ${BLUE}https://github.com/new${NC}"
    echo -e "2. Enter '$repo_name' as the repository name"
    echo -e "3. Add a description: 'Sanjeevani 2.0 - A comprehensive healthcare platform with multilingual support and advanced features'"
    echo -e "4. Choose '$visibility' visibility"
    echo -e "5. Do NOT initialize with README, .gitignore, or license"
    echo -e "6. Click 'Create repository'"
    echo
    read -p "Have you created the repository on GitHub? (y/n): " created_repo
    if [ "$created_repo" != "y" ]; then
        echo -e "${YELLOW}Please create the repository before continuing.${NC}"
        exit 0
    fi
    
    # Initialize git repository if not already initialized
    if [ ! -d ".git" ]; then
        git init
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to initialize git repository.${NC}"
            exit 1
        fi
    fi
    
    # Add remote origin
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to add remote origin.${NC}"
        exit 1
    fi
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo -e "${GREEN}Creating .gitignore file...${NC}"
    cat > .gitignore << EOL
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
EOL
fi

# Add all files to git
echo -e "${GREEN}Adding files to git...${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to add files to git.${NC}"
    exit 1
fi

# Commit changes
echo -e "${GREEN}Committing changes...${NC}"
git commit -m "Initial commit: Sanjeevani 2.0 healthcare platform"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to commit changes.${NC}"
    exit 1
fi

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
git push -u origin main
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Failed to push to 'main' branch. Trying 'master' branch...${NC}"
    git push -u origin master
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to push to GitHub. Please check your credentials and try again.${NC}"
        exit 1
    fi
fi

echo
echo -e "${GREEN}Success! Your code has been pushed to GitHub.${NC}"
echo -e "${BLUE}Repository URL: ${BLUE}https://github.com/$github_username/$repo_name${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Set up GitHub Secrets for CI/CD (run setup-github-secrets.sh)"
echo -e "2. Connect your repository to Netlify and Render"
echo -e "3. Push changes to trigger the CI/CD pipeline"
echo
