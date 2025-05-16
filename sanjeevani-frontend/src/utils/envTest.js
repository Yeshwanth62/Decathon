/**
 * This file is used to test that environment variables are properly loaded.
 * It should not be imported in production code.
 */

/**
 * Test that environment variables are properly loaded
 * @returns {Object} - An object containing the test results
 */
export const testEnvironmentVariables = () => {
  const results = {
    api: {
      apiUrl: process.env.REACT_APP_API_URL,
      socketUrl: process.env.REACT_APP_SOCKET_URL,
      socketServerUrl: process.env.REACT_APP_SOCKET_SERVER_URL,
    },
    featureFlags: {
      enableVoiceCommands: process.env.REACT_APP_ENABLE_VOICE_COMMANDS,
      enable3DModels: process.env.REACT_APP_ENABLE_3D_MODELS,
      enableEmergency: process.env.REACT_APP_ENABLE_EMERGENCY,
      max3DQuality: process.env.REACT_APP_MAX_3D_QUALITY,
    },
    analytics: {
      googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
      gaTrackingId: process.env.REACT_APP_GA_TRACKING_ID,
    },
    firebase: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Configured' : 'Not configured',
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Configured' : 'Not configured',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Configured' : 'Not configured',
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'Configured' : 'Not configured',
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'Configured' : 'Not configured',
      appId: process.env.REACT_APP_FIREBASE_APP_ID ? 'Configured' : 'Not configured',
    },
    errorTracking: {
      sentryDsn: process.env.REACT_APP_SENTRY_DSN ? 'Configured' : 'Not configured',
    },
    maps: {
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Configured' : 'Not configured',
    },
  };

  return results;
};

/**
 * Log the environment variable test results to the console
 */
export const logEnvironmentVariableTestResults = () => {
  console.log('Environment Variable Test Results:', testEnvironmentVariables());
};

// Automatically log the results when this file is imported
if (process.env.NODE_ENV === 'development') {
  logEnvironmentVariableTestResults();
}
