#!/bin/bash

# Sanjeevani 2.0 GitHub Actions Workflow Validator
# This script validates GitHub Actions workflows

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 GitHub Actions Workflow Validator ===${NC}"
echo -e "${YELLOW}This script validates GitHub Actions workflows.${NC}"
echo

# Check if actionlint is installed
if ! command -v actionlint &> /dev/null; then
    echo -e "${YELLOW}actionlint is not installed. Installing...${NC}"
    
    # Check OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to install actionlint.${NC}"
            echo -e "${YELLOW}Please install it manually from: ${BLUE}https://github.com/rhysd/actionlint${NC}"
            exit 1
        fi
        sudo mv ./actionlint /usr/local/bin/
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install actionlint
        if [ $? -ne 0 ]; then
            echo -e "${RED}Error: Failed to install actionlint.${NC}"
            echo -e "${YELLOW}Please install it manually from: ${BLUE}https://github.com/rhysd/actionlint${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Error: Unsupported OS. Please install actionlint manually from: ${BLUE}https://github.com/rhysd/actionlint${NC}"
        exit 1
    fi
fi

# Check if workflows directory exists
if [ ! -d ".github/workflows" ]; then
    echo -e "${RED}Error: .github/workflows directory not found.${NC}"
    exit 1
fi

# Validate workflows
echo -e "${GREEN}Validating GitHub Actions workflows...${NC}"
actionlint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}All workflows are valid!${NC}"
else
    echo -e "${RED}Workflow validation failed. Please fix the issues above.${NC}"
    exit 1
fi

# Check for secrets usage
echo -e "${YELLOW}Checking for secrets usage...${NC}"
grep -r "secrets\." .github/workflows --include="*.yml" --include="*.yaml" | sort | uniq > /tmp/secrets_used.txt

echo -e "${BLUE}The following secrets are used in your workflows:${NC}"
cat /tmp/secrets_used.txt

echo
echo -e "${YELLOW}Make sure all these secrets are set in your GitHub repository.${NC}"
echo -e "${YELLOW}You can use the setup-github-secrets.sh script to set them up.${NC}"
echo

# Check for environment variables
echo -e "${YELLOW}Checking for environment variables...${NC}"
grep -r "env:" .github/workflows --include="*.yml" --include="*.yaml" -A 20 | grep -v "^--$" | sort | uniq > /tmp/env_vars.txt

echo -e "${BLUE}The following environment variables are used in your workflows:${NC}"
cat /tmp/env_vars.txt

echo
echo -e "${GREEN}Workflow validation completed.${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Make sure all secrets are set in your GitHub repository"
echo -e "2. Make sure all environment variables are correctly configured"
echo -e "3. Push changes to trigger the CI/CD pipeline"
echo
