import { supportedLanguages } from '../i18n';

// Format date to display in user's locale
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time to display in user's locale
export const formatTime = (date, locale = 'en-US') => {
  if (!date) return '';

  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date and time together
export const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return '';

  return `${formatDate(date, locale)} at ${formatTime(date, locale)}`;
};

// Get user's preferred language code
export const getUserLanguage = () => {
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang && supportedLanguages[storedLang]) {
    return storedLang;
  }

  // Default to browser language if supported
  const browserLang = navigator.language.split('-')[0];
  if (supportedLanguages[browserLang]) {
    return browserLang;
  }

  // Fallback to English
  return 'en';
};

// Get language name from code
export const getLanguageName = (code) => {
  return supportedLanguages[code] || 'Unknown';
};

// Convert language code to locale
export const languageToLocale = (langCode) => {
  const localeMap = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    ml: 'ml-IN',
  };

  return localeMap[langCode] || 'en-US';
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 10) {
    // Assume international format
    return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(-10, -7)}-${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }

  // Return as is if can't format
  return phoneNumber;
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

// Get greeting based on time of day
export const getGreeting = (name = '', t) => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return t('greetings.morning', { name });
  } else if (hour < 17) {
    return t('greetings.afternoon', { name });
  } else {
    return t('greetings.evening', { name });
  }
};

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// Generate a random integer between min and max (inclusive)
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getUserLanguage,
  getLanguageName,
  languageToLocale,
  formatPhoneNumber,
  calculateAge,
  getGreeting,
  getCurrentLocation,
  getRandomInt,
  generateId,
};