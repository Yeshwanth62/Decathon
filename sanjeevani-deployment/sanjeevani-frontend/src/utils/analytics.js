/**
 * Track a page view in Google Analytics
 * @param {string} path - The path of the page
 */
export const trackPageView = (path) => {
  if (window.gtag && process.env.REACT_APP_GA_TRACKING_ID) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: path,
    });
  }
};

/**
 * Track an event in Google Analytics
 * @param {string} category - The event category
 * @param {string} action - The event action
 * @param {string} label - The event label
 * @param {number} value - The event value
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track a user login in Google Analytics
 * @param {string} method - The login method (e.g., 'email', 'google', 'facebook')
 */
export const trackLogin = (method) => {
  trackEvent('User', 'Login', method);
};

/**
 * Track a user registration in Google Analytics
 * @param {string} method - The registration method (e.g., 'email', 'google', 'facebook')
 */
export const trackRegistration = (method) => {
  trackEvent('User', 'Registration', method);
};

/**
 * Track an appointment booking in Google Analytics
 * @param {string} doctorSpecialty - The doctor's specialty
 * @param {string} appointmentType - The appointment type (e.g., 'in_person', 'telemedicine')
 */
export const trackAppointmentBooking = (doctorSpecialty, appointmentType) => {
  trackEvent('Appointment', 'Booking', `${doctorSpecialty} - ${appointmentType}`);
};

/**
 * Track a language change in Google Analytics
 * @param {string} language - The new language
 */
export const trackLanguageChange = (language) => {
  trackEvent('User', 'Language Change', language);
};

/**
 * Track a voice command in Google Analytics
 * @param {string} command - The voice command
 * @param {boolean} recognized - Whether the command was recognized
 */
export const trackVoiceCommand = (command, recognized) => {
  trackEvent('Voice', recognized ? 'Recognized Command' : 'Unrecognized Command', command);
};

/**
 * Track a 3D model interaction in Google Analytics
 * @param {string} modelType - The model type (e.g., 'heart', 'lungs', 'brain')
 * @param {string} interactionType - The interaction type (e.g., 'rotate', 'zoom', 'pan')
 */
export const track3DModelInteraction = (modelType, interactionType) => {
  trackEvent('3D Model', interactionType, modelType);
};

/**
 * Track an emergency button press in Google Analytics
 */
export const trackEmergency = () => {
  trackEvent('Emergency', 'Button Press');
};
