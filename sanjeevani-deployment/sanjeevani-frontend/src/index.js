import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import { initSentry, SentryErrorBoundary } from './utils/sentry';

// Initialize Sentry for error tracking
initSentry();

// Create a custom theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <SentryErrorBoundary fallback={
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <p>We've been notified about this issue and we'll take a look at it shortly.</p>
            <button onClick={() => window.location.reload()}>Refresh the page</button>
          </div>
        }>
          <App />
        </SentryErrorBoundary>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
