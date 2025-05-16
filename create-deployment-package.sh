#!/bin/bash

# Sanjeevani 2.0 Deployment Package Creator
# This script creates a deployment package for Sanjeevani 2.0

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 Deployment Package Creator ===${NC}"
echo -e "${YELLOW}This script creates a deployment package for Sanjeevani 2.0.${NC}"
echo

# Create deployment directory
echo -e "${GREEN}Creating deployment directory...${NC}"
mkdir -p deployment-package
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create deployment directory.${NC}"
    exit 1
fi

# Copy deployment files
echo -e "${GREEN}Copying deployment files...${NC}"
cp DEPLOYMENT.md deployment-package/
cp DEPLOYMENT_CHECKLIST.md deployment-package/
cp MONITORING.md deployment-package/
cp SECURITY.md deployment-package/
cp HANDOFF.md deployment-package/
cp setup-github.sh deployment-package/
cp setup-github-secrets.sh deployment-package/
cp validate-workflows.sh deployment-package/
cp deploy.sh deployment-package/
cp github-upload.sh deployment-package/
cp generate-pdf.sh deployment-package/
cp deployment-summary.html deployment-package/
mkdir -p deployment-package/env-templates
cp env-templates/* deployment-package/env-templates/
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to copy deployment files.${NC}"
    exit 1
fi

# Copy GitHub Actions workflows
echo -e "${GREEN}Copying GitHub Actions workflows...${NC}"
mkdir -p deployment-package/.github/workflows
cp .github/workflows/* deployment-package/.github/workflows/
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to copy GitHub Actions workflows.${NC}"
    exit 1
fi

# Create README.md
echo -e "${GREEN}Creating README.md...${NC}"
cat > deployment-package/README.md << EOL
# Sanjeevani 2.0 Deployment Package

This package contains everything you need to deploy Sanjeevani 2.0 to production.

## Contents

- \`DEPLOYMENT.md\` - Deployment guide
- \`DEPLOYMENT_CHECKLIST.md\` - Deployment checklist
- \`MONITORING.md\` - Monitoring and observability guide
- \`SECURITY.md\` - Security guide
- \`HANDOFF.md\` - Project handoff document
- \`setup-github.sh\` - GitHub repository setup script
- \`setup-github-secrets.sh\` - GitHub Secrets setup script
- \`validate-workflows.sh\` - GitHub Actions workflow validator
- \`deploy.sh\` - One-line deploy script
- \`github-upload.sh\` - GitHub repository upload helper
- \`generate-pdf.sh\` - PDF generator for documentation
- \`deployment-summary.html\` - Deployment summary
- \`env-templates/\` - Environment variable templates
- \`.github/workflows/\` - GitHub Actions workflows

## Getting Started

1. Read \`DEPLOYMENT.md\` for deployment instructions
2. Use \`DEPLOYMENT_CHECKLIST.md\` to track deployment progress
3. Run \`deploy.sh\` for a guided deployment process, or:
   - Run \`github-upload.sh\` to upload your repository to GitHub
   - Run \`setup-github-secrets.sh\` to set up GitHub Secrets
   - Run \`validate-workflows.sh\` to validate GitHub Actions workflows
4. Run \`generate-pdf.sh\` to generate PDF documentation

## Additional Resources

- \`MONITORING.md\` - Information on monitoring and observability
- \`SECURITY.md\` - Information on security measures
- \`HANDOFF.md\` - Comprehensive project handoff document
- \`deployment-summary.html\` - HTML version of deployment summary
- \`env-templates/\` - Templates for environment variables
EOL
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create README.md.${NC}"
    exit 1
fi

# Make scripts executable
echo -e "${GREEN}Making scripts executable...${NC}"
chmod +x deployment-package/setup-github.sh
chmod +x deployment-package/setup-github-secrets.sh
chmod +x deployment-package/validate-workflows.sh
chmod +x deployment-package/deploy.sh
chmod +x deployment-package/github-upload.sh
chmod +x deployment-package/generate-pdf.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to make scripts executable.${NC}"
    exit 1
fi

# Create zip file
echo -e "${GREEN}Creating zip file...${NC}"
zip -r sanjeevani-deployment-package.zip deployment-package
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create zip file.${NC}"
    exit 1
fi

# Clean up
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf deployment-package
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to clean up.${NC}"
    exit 1
fi

echo
echo -e "${GREEN}Success! Deployment package created: sanjeevani-deployment-package.zip${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Extract the deployment package"
echo -e "2. Follow the instructions in DEPLOYMENT.md"
echo -e "3. Use the scripts to set up your GitHub repository and secrets"
echo -e "4. Deploy Sanjeevani 2.0 to production"
echo
