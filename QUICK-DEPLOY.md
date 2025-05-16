# Sanjeevani 2.0 Quick Deployment Guide

This guide provides quick instructions for deploying the Sanjeevani 2.0 application in its current state (frontend with demo mode).

## Deployment Options

### 1. Netlify Deployment (Recommended)

The easiest way to deploy the Sanjeevani 2.0 frontend is using Netlify's drag-and-drop deployment:

1. Run the deployment script:
   ```
   powershell -ExecutionPolicy Bypass -File deploy-to-netlify.ps1
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `sanjeevani-deployment.zip` file onto the page

4. Wait for the deployment to complete

5. Your site will be available at a Netlify subdomain (e.g., `sanjeevani.netlify.app`)

### 2. Docker Deployment

To deploy using Docker:

1. Make sure Docker is installed on your system

2. Run the deployment script:
   ```
   powershell -ExecutionPolicy Bypass -File deploy-to-docker.ps1
   ```

3. Access the application at `http://localhost:8080`

### 3. Local Development Server

To run the application locally:

1. Start the development server:
   ```
   cd sanjeevani-frontend
   npm start
   ```

2. Access the application at `http://localhost:3000`

## Demo Mode

The application is currently configured to run in "demo mode" without a backend server. This allows you to showcase the UI and features without setting up a backend.

Key features in demo mode:
- Mock authentication (any credentials will work)
- Simulated health data
- Appointment booking simulation
- Multilingual support
- Voice command simulation
- Emergency services simulation

## Next Steps

For a complete healthcare solution, refer to the full `DEPLOYMENT.md` guide for instructions on:
- Setting up the backend server
- Configuring a database
- Setting up authentication
- Deploying to production environments

## Troubleshooting

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify that the build was successful
3. Make sure Docker is running (for Docker deployment)
4. Check that you have the necessary permissions to deploy to Netlify
