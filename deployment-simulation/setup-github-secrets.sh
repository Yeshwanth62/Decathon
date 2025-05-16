#!/bin/bash

# Sanjeevani 2.0 GitHub Secrets Setup Script
# This script helps set up GitHub secrets for Sanjeevani 2.0 CI/CD

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sanjeevani 2.0 GitHub Secrets Setup Script ===${NC}"
echo -e "${YELLOW}This script will help you set up GitHub secrets for CI/CD.${NC}"
echo

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo -e "${YELLOW}Please install it from: ${BLUE}https://cli.github.com/${NC}"
    exit 1
fi

# Check if logged in to GitHub CLI
gh auth status &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to log in to GitHub CLI.${NC}"
    gh auth login
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to log in to GitHub CLI.${NC}"
        exit 1
    fi
fi

# Get repository information
read -p "Enter your GitHub username: " github_username
if [ -z "$github_username" ]; then
    echo -e "${RED}Error: GitHub username cannot be empty.${NC}"
    exit 1
fi

read -p "Enter repository name (default: sanjeevani-2.0): " repo_name
repo_name=${repo_name:-sanjeevani-2.0}

# Verify repository exists
gh repo view "$github_username/$repo_name" &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Repository $github_username/$repo_name not found.${NC}"
    exit 1
fi

echo -e "${GREEN}Setting up secrets for $github_username/$repo_name...${NC}"
echo

# Frontend secrets
echo -e "${BLUE}Frontend Secrets${NC}"
echo -e "${YELLOW}These secrets are used by the frontend CI/CD pipeline.${NC}"
echo

# Firebase configuration
echo -e "${YELLOW}Firebase Configuration${NC}"
read -p "Enter Firebase API Key: " firebase_api_key
read -p "Enter Firebase Auth Domain: " firebase_auth_domain
read -p "Enter Firebase Project ID: " firebase_project_id
read -p "Enter Firebase Storage Bucket: " firebase_storage_bucket
read -p "Enter Firebase Messaging Sender ID: " firebase_messaging_sender_id
read -p "Enter Firebase App ID: " firebase_app_id

# Google Maps configuration
echo -e "${YELLOW}Google Maps Configuration${NC}"
read -p "Enter Google Maps API Key: " google_maps_api_key

# Analytics configuration
echo -e "${YELLOW}Analytics Configuration${NC}"
read -p "Enter Google Analytics Tracking ID: " ga_tracking_id

# Error tracking configuration
echo -e "${YELLOW}Error Tracking Configuration${NC}"
read -p "Enter Sentry DSN: " sentry_dsn

# Netlify configuration
echo -e "${YELLOW}Netlify Configuration${NC}"
read -p "Enter Netlify Auth Token: " netlify_auth_token
read -p "Enter Netlify Site ID: " netlify_site_id

# Backend secrets
echo -e "${BLUE}Backend Secrets${NC}"
echo -e "${YELLOW}These secrets are used by the backend CI/CD pipeline.${NC}"
echo

# MongoDB configuration
echo -e "${YELLOW}MongoDB Configuration${NC}"
read -p "Enter MongoDB URL: " mongodb_url
read -p "Enter MongoDB Database Name: " mongodb_db_name

# JWT configuration
echo -e "${YELLOW}JWT Configuration${NC}"
read -p "Enter JWT Secret Key: " jwt_secret_key
read -p "Enter JWT Algorithm (default: HS256): " jwt_algorithm
jwt_algorithm=${jwt_algorithm:-HS256}
read -p "Enter JWT Access Token Expire Minutes (default: 60): " jwt_access_token_expire_minutes
jwt_access_token_expire_minutes=${jwt_access_token_expire_minutes:-60}
read -p "Enter JWT Refresh Token Expire Days (default: 7): " jwt_refresh_token_expire_days
jwt_refresh_token_expire_days=${jwt_refresh_token_expire_days:-7}

# Firebase credentials
echo -e "${YELLOW}Firebase Credentials (JSON)${NC}"
echo -e "${YELLOW}Enter the path to your Firebase credentials JSON file:${NC}"
read -p "Path: " firebase_credentials_path
if [ ! -f "$firebase_credentials_path" ]; then
    echo -e "${RED}Error: Firebase credentials file not found.${NC}"
    exit 1
fi
firebase_credentials=$(cat "$firebase_credentials_path" | base64)

# Twilio configuration
echo -e "${YELLOW}Twilio Configuration${NC}"
read -p "Enter Twilio Account SID: " twilio_account_sid
read -p "Enter Twilio Auth Token: " twilio_auth_token
read -p "Enter Twilio Phone Number: " twilio_phone_number

# Render configuration
echo -e "${YELLOW}Render Configuration${NC}"
read -p "Enter Render Token: " render_token

# Set GitHub secrets
echo -e "${GREEN}Setting GitHub secrets...${NC}"

# Frontend secrets
gh secret set REACT_APP_FIREBASE_API_KEY -b "$firebase_api_key" -R "$github_username/$repo_name"
gh secret set REACT_APP_FIREBASE_AUTH_DOMAIN -b "$firebase_auth_domain" -R "$github_username/$repo_name"
gh secret set REACT_APP_FIREBASE_PROJECT_ID -b "$firebase_project_id" -R "$github_username/$repo_name"
gh secret set REACT_APP_FIREBASE_STORAGE_BUCKET -b "$firebase_storage_bucket" -R "$github_username/$repo_name"
gh secret set REACT_APP_FIREBASE_MESSAGING_SENDER_ID -b "$firebase_messaging_sender_id" -R "$github_username/$repo_name"
gh secret set REACT_APP_FIREBASE_APP_ID -b "$firebase_app_id" -R "$github_username/$repo_name"
gh secret set REACT_APP_GOOGLE_MAPS_API_KEY -b "$google_maps_api_key" -R "$github_username/$repo_name"
gh secret set REACT_APP_GA_TRACKING_ID -b "$ga_tracking_id" -R "$github_username/$repo_name"
gh secret set REACT_APP_SENTRY_DSN -b "$sentry_dsn" -R "$github_username/$repo_name"
gh secret set NETLIFY_AUTH_TOKEN -b "$netlify_auth_token" -R "$github_username/$repo_name"
gh secret set NETLIFY_SITE_ID -b "$netlify_site_id" -R "$github_username/$repo_name"

# Backend secrets
gh secret set MONGODB_URL -b "$mongodb_url" -R "$github_username/$repo_name"
gh secret set MONGODB_DB_NAME -b "$mongodb_db_name" -R "$github_username/$repo_name"
gh secret set JWT_SECRET_KEY -b "$jwt_secret_key" -R "$github_username/$repo_name"
gh secret set JWT_ALGORITHM -b "$jwt_algorithm" -R "$github_username/$repo_name"
gh secret set JWT_ACCESS_TOKEN_EXPIRE_MINUTES -b "$jwt_access_token_expire_minutes" -R "$github_username/$repo_name"
gh secret set JWT_REFRESH_TOKEN_EXPIRE_DAYS -b "$jwt_refresh_token_expire_days" -R "$github_username/$repo_name"
gh secret set FIREBASE_CREDENTIALS -b "$firebase_credentials" -R "$github_username/$repo_name"
gh secret set TWILIO_ACCOUNT_SID -b "$twilio_account_sid" -R "$github_username/$repo_name"
gh secret set TWILIO_AUTH_TOKEN -b "$twilio_auth_token" -R "$github_username/$repo_name"
gh secret set TWILIO_PHONE_NUMBER -b "$twilio_phone_number" -R "$github_username/$repo_name"
gh secret set GOOGLE_MAPS_API_KEY -b "$google_maps_api_key" -R "$github_username/$repo_name"
gh secret set SENTRY_DSN -b "$sentry_dsn" -R "$github_username/$repo_name"
gh secret set RENDER_TOKEN -b "$render_token" -R "$github_username/$repo_name"

echo
echo -e "${GREEN}Success! GitHub secrets have been set up for $github_username/$repo_name.${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Connect your repository to Netlify and Render"
echo -e "2. Push changes to trigger the CI/CD pipeline"
echo
echo -e "${YELLOW}Repository URL: ${BLUE}https://github.com/$github_username/$repo_name${NC}"
echo
