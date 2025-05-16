import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry for error tracking
 */
export const initSentry = () => {
  // Check if we have a valid Sentry DSN (not a placeholder)
  if (process.env.REACT_APP_SENTRY_DSN &&
      process.env.REACT_APP_SENTRY_DSN !== 'demo-sentry-dsn' &&
      process.env.REACT_APP_SENTRY_DSN.includes('sentry.io')) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      environment: process.env.NODE_ENV,
      // Don't capture errors in development
      enabled: process.env.NODE_ENV === 'production',
      // Set beforeSend to filter out errors you don't want to send to Sentry
      beforeSend(event) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
          Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
      },
    });
  } else {
    console.warn('Sentry DSN not provided or invalid. Error tracking is disabled.');
  }
};

/**
 * Capture an exception and send it to Sentry
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context to add to the error
 */
export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
    Sentry.captureException(error);
  });
};

/**
 * Capture a message and send it to Sentry
 * @param {string} message - The message to capture
 * @param {Object} context - Additional context to add to the message
 */
export const captureMessage = (message, context = {}) => {
  Sentry.withScope((scope) => {
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
    Sentry.captureMessage(message);
  });
};

/**
 * Set user information for Sentry
 * @param {Object} user - The user object
 */
export const setUser = (user) => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });
  } else {
    // Clear user data
    Sentry.setUser(null);
  }
};

/**
 * Create a Sentry error boundary component
 * @param {Object} options - Options for the error boundary
 * @returns {Component} - A React error boundary component
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;
