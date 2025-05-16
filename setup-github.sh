#!/bin/bash

# Sanjeevani 2.0 GitHub Setup Script
# This script helps set up a GitHub repository for Sanjeevani 2.0 and push the code

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 GitHub Setup Script ===${NC}"
echo -e "${YELLOW}This script will help you set up a GitHub repository and push your code.${NC}"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed. Please install git first.${NC}"
    exit 1
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

# Check if .git directory already exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}A git repository already exists in this directory.${NC}"
    read -p "Do you want to continue and use the existing repository? (y/n): " use_existing
    if [ "$use_existing" != "y" ]; then
        echo -e "${YELLOW}Exiting script. Please run in a directory without an existing git repository.${NC}"
        exit 0
    fi
else
    # Initialize git repository
    echo -e "${GREEN}Initializing git repository...${NC}"
    git init
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to initialize git repository.${NC}"
        exit 1
    fi
fi

# Create .gitignore if it doesn't exist
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

# Create GitHub repository
echo -e "${YELLOW}Now you need to create a repository on GitHub:${NC}"
echo -e "1. Go to ${BLUE}https://github.com/new${NC}"
echo -e "2. Enter '${repo_name}' as the repository name"
echo -e "3. Add a description: 'A comprehensive healthcare platform with multilingual support and advanced features'"
echo -e "4. Choose 'Public' or 'Private' visibility based on your needs"
echo -e "5. Do NOT initialize with README, .gitignore, or license (we already have these)"
echo -e "6. Click 'Create repository'"
echo
read -p "Have you created the repository on GitHub? (y/n): " created_repo
if [ "$created_repo" != "y" ]; then
    echo -e "${YELLOW}Please create the repository before continuing.${NC}"
    exit 0
fi

# Add remote origin
echo -e "${GREEN}Adding remote origin...${NC}"
git remote add origin "https://github.com/$github_username/$repo_name.git"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to add remote origin.${NC}"
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
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Set up GitHub Secrets for CI/CD (see deployment-summary.html for details)"
echo -e "2. Connect your repository to Netlify and Render"
echo -e "3. Push changes to trigger the CI/CD pipeline"
echo
echo -e "${YELLOW}Repository URL: ${BLUE}https://github.com/$github_username/$repo_name${NC}"
echo
