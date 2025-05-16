import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getPerformance, trace } from 'firebase/performance';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Performance Monitoring
let perf = null;
if (process.env.NODE_ENV === 'production') {
  perf = getPerformance(app);
}

/**
 * Create a performance trace
 * @param {string} traceName - The name of the trace
 * @returns {object} - The trace object
 */
export const createPerformanceTrace = (traceName) => {
  if (perf) {
    return trace(perf, traceName);
  }
  return null;
};

/**
 * Start a performance trace
 * @param {object} traceObj - The trace object
 */
export const startPerformanceTrace = (traceObj) => {
  if (traceObj) {
    traceObj.start();
  }
};

/**
 * Stop a performance trace
 * @param {object} traceObj - The trace object
 */
export const stopPerformanceTrace = (traceObj) => {
  if (traceObj) {
    traceObj.stop();
  }
};

/**
 * Add a custom attribute to a performance trace
 * @param {object} traceObj - The trace object
 * @param {string} name - The attribute name
 * @param {string} value - The attribute value
 */
export const putTraceAttribute = (traceObj, name, value) => {
  if (traceObj) {
    traceObj.putAttribute(name, value);
  }
};

/**
 * Add a custom metric to a performance trace
 * @param {object} traceObj - The trace object
 * @param {string} name - The metric name
 * @param {number} value - The metric value
 */
export const putTraceMetric = (traceObj, name, value) => {
  if (traceObj) {
    traceObj.putMetric(name, value);
  }
};

/**
 * Sign in with email and password
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - The sign in promise
 */
export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Create a new user with email and password
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - The create user promise
 */
export const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 * @returns {Promise} - The sign out promise
 */
export const signOutUser = () => {
  return signOut(auth);
};

/**
 * Send a password reset email
 * @param {string} email - The user's email
 * @returns {Promise} - The password reset promise
 */
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
