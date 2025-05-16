# Sanjeevani 2.0 Frontend Environment Setup

This document provides instructions for setting up the environment variables for the Sanjeevani 2.0 frontend application.

## Environment Variables

The Sanjeevani 2.0 frontend application uses environment variables to configure various aspects of the application. These variables are stored in a `.env` file in the root of the project.

### API Configuration

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
REACT_APP_SOCKET_SERVER_URL=http://localhost:8000
```

- `REACT_APP_API_URL`: The URL of the backend API server
- `REACT_APP_SOCKET_URL`: The URL of the WebSocket server
- `REACT_APP_SOCKET_SERVER_URL`: The URL of the Socket.IO server

### Feature Flags

```
REACT_APP_ENABLE_VOICE_COMMANDS=true
REACT_APP_ENABLE_3D_MODELS=true
REACT_APP_ENABLE_EMERGENCY=true
REACT_APP_MAX_3D_QUALITY=high
```

- `REACT_APP_ENABLE_VOICE_COMMANDS`: Whether to enable voice commands
- `REACT_APP_ENABLE_3D_MODELS`: Whether to enable 3D models
- `REACT_APP_ENABLE_EMERGENCY`: Whether to enable the emergency button
- `REACT_APP_MAX_3D_QUALITY`: The maximum quality of 3D models (low, medium, high)

### Google Analytics

```
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

- `REACT_APP_GOOGLE_ANALYTICS_ID`: The Google Analytics measurement ID
- `REACT_APP_GA_TRACKING_ID`: The Google Analytics tracking ID (same as above)

### Firebase Configuration

```
REACT_APP_FIREBASE_API_KEY=AIzaSyA1BCdefGHIjklMNOpqrsTUVwxyz12345
REACT_APP_FIREBASE_AUTH_DOMAIN=sanjeevani-health.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=sanjeevani-health
REACT_APP_FIREBASE_STORAGE_BUCKET=sanjeevani-health.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abc123def456
```

- `REACT_APP_FIREBASE_API_KEY`: The Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: The Firebase authentication domain
- `REACT_APP_FIREBASE_PROJECT_ID`: The Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: The Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: The Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: The Firebase application ID

### Error Tracking

```
REACT_APP_SENTRY_DSN=https://examplekey@o123456.ingest.sentry.io/1234567
```

- `REACT_APP_SENTRY_DSN`: The Sentry DSN for error tracking

### Google Maps Configuration

```
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

- `REACT_APP_GOOGLE_MAPS_API_KEY`: The Google Maps API key

## How to Get These Values

### Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. Copy the configuration values from the Firebase SDK snippet

### Google Analytics

1. Go to the [Google Analytics Console](https://analytics.google.com/)
2. Create a new property
3. Copy the measurement ID (G-XXXXXXXXXX)

### Sentry

1. Go to the [Sentry Dashboard](https://sentry.io/)
2. Create a new project
3. Copy the DSN from the project settings

### Google Maps

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Maps JavaScript API
4. Create an API key and copy it

## Production Environment

For production, you should set these environment variables in your deployment platform (e.g., Vercel, Netlify, etc.) rather than committing them to your repository.

## Development Environment

For development, you can create a `.env.local` file in the root of the project with your development environment variables. This file should not be committed to your repository.
