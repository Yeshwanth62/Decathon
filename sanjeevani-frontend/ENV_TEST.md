# Testing Environment Variables in Sanjeevani 2.0

This document explains how to test that your environment variables are properly configured in the Sanjeevani 2.0 frontend application.

## Using the Environment Test Page

In development mode, you can access a special page that displays all the environment variables loaded in the application:

1. Start the development server:
   ```
   cd sanjeevani-frontend
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/env-test
   ```

3. This page will display all the environment variables loaded in the application, including:
   - API Configuration
   - Feature Flags
   - Google Analytics
   - Firebase Configuration
   - Error Tracking (Sentry)
   - Google Maps

4. For security reasons, the actual values of sensitive environment variables (like API keys) are not displayed. Instead, the page shows whether they are configured or not.

## Using the Console

You can also check the environment variables in the browser console:

1. Start the development server:
   ```
   cd sanjeevani-frontend
   npm start
   ```

2. Open your browser and navigate to any page in the application.

3. Open the browser console (F12 or right-click > Inspect > Console).

4. The environment variable test results will be automatically logged to the console in development mode.

## Troubleshooting

If your environment variables are not being loaded correctly, check the following:

1. Make sure your `.env` file is in the root of the project (same level as `package.json`).

2. Make sure all environment variables start with `REACT_APP_`. Create React App only loads environment variables that start with this prefix.

3. After changing the `.env` file, restart the development server for the changes to take effect.

4. If you're using a custom environment file (e.g., `.env.development` or `.env.production`), make sure it's properly named and in the correct location.

5. If you're deploying to a hosting platform (e.g., Vercel, Netlify), make sure you've configured the environment variables in the platform's settings.

## Security Considerations

Remember that environment variables in a React application are embedded in the JavaScript bundle and are visible to users. Do not store sensitive information (like API keys with admin privileges) in environment variables. Instead, use a backend service to handle sensitive operations.

For more information, see the [Create React App documentation on environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/).
