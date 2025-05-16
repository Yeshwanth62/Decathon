# Sanjeevani 2.0 Deployment Guide

This guide provides step-by-step instructions for deploying Sanjeevani 2.0 to production using GitHub Actions, Netlify, and Render.

## Prerequisites

Before you begin, make sure you have the following:

- A GitHub account
- A Netlify account
- A Render account
- A Firebase project
- A MongoDB Atlas cluster
- A Twilio account
- A Google Maps API key
- A Google Analytics account
- A Sentry account

## 1. GitHub Repository Setup

### Automatic Setup

We've provided a script to help you set up your GitHub repository:

```bash
# Make the script executable
chmod +x setup-github.sh

# Run the script
./setup-github.sh
```

### Manual Setup

If you prefer to set up your repository manually:

1. Create a new repository on GitHub
2. Initialize a git repository in your local project directory
3. Add the GitHub repository as a remote
4. Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Sanjeevani 2.0 healthcare platform"
git remote add origin https://github.com/yourusername/sanjeevani-2.0.git
git push -u origin main
```

## 2. GitHub Secrets Setup

GitHub Secrets are used to securely store sensitive information like API keys and tokens.

### Automatic Setup

We've provided a script to help you set up your GitHub Secrets:

```bash
# Make the script executable
chmod +x setup-github-secrets.sh

# Run the script
./setup-github-secrets.sh
```

### Manual Setup

If you prefer to set up your secrets manually:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:

#### Frontend Secrets
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_GOOGLE_MAPS_API_KEY`
- `REACT_APP_GA_TRACKING_ID`
- `REACT_APP_SENTRY_DSN`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

#### Backend Secrets
- `MONGODB_URL`
- `MONGODB_DB_NAME`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS`
- `FIREBASE_CREDENTIALS` (base64 encoded JSON)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `GOOGLE_MAPS_API_KEY`
- `SENTRY_DSN`
- `RENDER_TOKEN`

## 3. Netlify Setup

Netlify is used to deploy the frontend of Sanjeevani 2.0.

1. Go to [Netlify](https://app.netlify.com/) and sign in
2. Click "New site from Git"
3. Select "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your "sanjeevani-2.0" repository
6. Configure the build settings:
   - Base directory: `sanjeevani-frontend`
   - Build command: `npm run build`
   - Publish directory: `sanjeevani-frontend/build`
7. Click "Show advanced" and add the environment variables from your frontend `.env.production` file
8. Click "Deploy site"

## 4. Render Setup

Render is used to deploy the backend of Sanjeevani 2.0.

1. Go to [Render](https://dashboard.render.com/) and sign in
2. Click "New" > "Web Service"
3. Select your "sanjeevani-2.0" repository
4. Configure the service:
   - Name: "sanjeevani-api"
   - Root Directory: `sanjeevani-backend`
   - Runtime: "Python 3"
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the environment variables from your backend `.env.production` file
6. Click "Create Web Service"

## 5. Trigger CI/CD Pipeline

Once you've set up your GitHub repository, GitHub Secrets, Netlify, and Render, you can trigger the CI/CD pipeline by pushing changes to your repository:

```bash
git add .
git commit -m "Update configuration"
git push
```

This will trigger the GitHub Actions workflows, which will build and deploy your application to Netlify and Render.

## 6. Verify Deployment

After the CI/CD pipeline has completed, verify that your application is deployed correctly:

1. Check the GitHub Actions workflows to make sure they completed successfully
2. Visit your Netlify site to verify that the frontend is deployed
3. Visit your Render service to verify that the backend is deployed
4. Test the application to make sure all features are working correctly

## 7. Post-Deployment Tasks

After deploying your application, there are a few additional tasks you should complete:

1. Set up a custom domain for your frontend and backend
2. Configure SSL certificates for your custom domains
3. Set up monitoring and alerting for your application
4. Set up backups for your MongoDB database
5. Set up logging and error tracking for your application

## Troubleshooting

If you encounter any issues during deployment, check the following:

1. GitHub Actions logs for any errors
2. Netlify deployment logs for frontend issues
3. Render logs for backend issues
4. Make sure all environment variables are set correctly
5. Check that your MongoDB connection string is correct
6. Verify that your Firebase credentials are valid

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Sentry Documentation](https://docs.sentry.io/)
- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Twilio Documentation](https://www.twilio.com/docs)
