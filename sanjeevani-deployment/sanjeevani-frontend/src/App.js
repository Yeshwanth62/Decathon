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

// Utils
import { getUser, isAuthenticated } from './utils/auth';
import { trackPageView } from './utils/analytics';
import { setUser as setSentryUser } from './utils/sentry';

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
        toast({
          title: t('auth.error'),
          description: t('auth.sessionExpired'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
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

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <Navbar user={user} onLogout={handleLogout} />
      
      <Box as="main" p={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/appointments" element={<AppointmentBooking user={user} />} />
          <Route path="/health-model/:modelType" element={<HealthModel3D />} />
        </Routes>
      </Box>
      
      <LanguageSelector />
      <EmergencyButton user={user} />
      <VoiceAssistant 
        isActive={voiceAssistantActive} 
        onToggle={toggleVoiceAssistant} 
      />
      <NotificationSystem user={user} />
    </Box>
  );
}

export default App;
