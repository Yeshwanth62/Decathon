import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppointmentBooking from './pages/AppointmentBooking';

// Components
import Navbar from './components/Navbar';
import EmergencyButton from './components/EmergencyButton';
import LanguageSelector from './components/LanguageSelector';
import VoiceAssistant from './components/VoiceAssistant';
import NotificationSystem from './components/NotificationSystem';
import HealthModel3D from './components/HealthModel3D';
import DemoBanner from './components/DemoBanner';

// Utils
import { getUser, isAuthenticated } from './utils/auth';
import { trackPageView } from './utils/analytics';
import { setUser as setSentryUser } from './utils/sentry';

// Development-only components
const EnvTestDisplay = process.env.NODE_ENV === 'development'
  ? React.lazy(() => import('./components/EnvTestDisplay'))
  : () => null;

function App() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voiceAssistantActive, setVoiceAssistantActive] = useState(false);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getUser();
          setUser(userData);

          // Set user in Sentry for error tracking
          setSentryUser(userData);
        } else {
          // Clear user in Sentry
          setSentryUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);

        // Only show toast if there was a valid token that expired
        // Don't show for initial app load or network errors
        if (localStorage.getItem('token')) {
          // Check if it's a network error
          if (error.message && (error.message.includes('NetworkError') ||
              error.message.includes('Failed to fetch') ||
              error.name === 'TypeError')) {
            // Don't show toast for network errors on initial load
          } else {
            toast({
              title: t('auth.error'),
              description: t('auth.sessionExpired'),
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [t, toast]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);

    // Clear user in Sentry
    setSentryUser(null);

    navigate('/');
    toast({
      title: t('auth.loggedOut'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Toggle voice assistant
  const toggleVoiceAssistant = () => {
    setVoiceAssistantActive(!voiceAssistantActive);
  };

  return (
    <Box minH="100vh" position="relative">
      {/* Demo Banner */}
      <DemoBanner />

      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        toggleVoiceAssistant={toggleVoiceAssistant}
      />

      {/* Main Content */}
      <Box as="main" pt="100px" pb="50px">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={user}
                loading={loading}
              />
            }
          />
          <Route
            path="/appointments/book"
            element={
              <AppointmentBooking
                user={user}
                loading={loading}
              />
            }
          />
          {/* Development-only routes */}
          {process.env.NODE_ENV === 'development' && (
            <Route
              path="/env-test"
              element={
                <React.Suspense fallback={<Box p={5}>Loading...</Box>}>
                  <EnvTestDisplay />
                </React.Suspense>
              }
            />
          )}
        </Routes>
      </Box>

      {/* Fixed Components */}
      <LanguageSelector position="fixed" top="110px" right="20px" zIndex="1000" />
      <EmergencyButton position="fixed" bottom="20px" right="20px" zIndex="1000" />

      {/* Voice Assistant */}
      {voiceAssistantActive && (
        <VoiceAssistant
          isActive={voiceAssistantActive}
          onClose={() => setVoiceAssistantActive(false)}
          user={user}
        />
      )}
    </Box>
  );
}

export default App;