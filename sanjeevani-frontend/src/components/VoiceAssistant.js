import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  VStack,
  HStack,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const VoiceAssistant = ({ isActive, onClose, user }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  const [processing, setProcessing] = useState(false);

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: t('voice.notSupported'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  }, [browserSupportsSpeechRecognition, onClose, t, toast]);

  // Natural language processing for commands
  const findBestMatch = (command, commandPatterns) => {
    // Convert command to lowercase and remove punctuation
    const normalizedCommand = command.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    // Check for exact matches first
    for (const pattern of commandPatterns) {
      if (normalizedCommand === pattern.toLowerCase()) {
        return 1.0;
      }
    }

    // Check for includes
    for (const pattern of commandPatterns) {
      if (normalizedCommand.includes(pattern.toLowerCase())) {
        return 0.9;
      }
    }

    // Check for word-by-word matches
    const commandWords = normalizedCommand.split(/\s+/);

    for (const pattern of commandPatterns) {
      const patternWords = pattern.toLowerCase().split(/\s+/);
      let matchCount = 0;

      for (const patternWord of patternWords) {
        if (commandWords.includes(patternWord)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const score = matchCount / patternWords.length;
        if (score >= 0.7) {
          return score;
        }
      }
    }

    return 0;
  };

  // Get command patterns in current language
  const getCommandPatterns = useCallback((commandKey) => {
    // Get the base command
    const baseCommand = t(`voice.commands.${commandKey}`).toLowerCase();

    // Generate variations
    const variations = [
      baseCommand,
      `please ${baseCommand}`,
      `can you ${baseCommand}`,
      `i want to ${baseCommand}`,
      `${baseCommand} please`,
    ];

    return variations;
  }, [t]);

  // Process voice command
  const processCommand = useCallback(async (command) => {
    setProcessing(true);

    try {
      // Convert command to lowercase for easier matching
      const lowerCommand = command.toLowerCase();

      // Define command types and their patterns
      const commandTypes = {
        home: getCommandPatterns('home'),
        dashboard: getCommandPatterns('dashboard'),
        appointments: getCommandPatterns('appointments'),
        bookAppointment: ['book appointment', 'schedule appointment', 'make appointment', 'new appointment'],
        login: getCommandPatterns('login'),
        changeLanguage: getCommandPatterns('changeLanguage'),
        emergency: getCommandPatterns('emergency'),
        help: getCommandPatterns('help'),
        profile: ['go to profile', 'open profile', 'show profile', 'my profile'],
        settings: ['go to settings', 'open settings', 'show settings', 'change settings'],
        logout: ['logout', 'sign out', 'log out', 'exit account'],
        medicalRecords: ['medical records', 'health records', 'my records', 'show my records'],
        findDoctor: ['find doctor', 'search doctor', 'find a doctor', 'look for doctor'],
        findHospital: ['find hospital', 'search hospital', 'find a hospital', 'look for hospital']
      };

      // Find best matching command
      let bestMatch = null;
      let bestScore = 0;

      for (const [type, patterns] of Object.entries(commandTypes)) {
        const score = findBestMatch(lowerCommand, patterns);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = type;
        }
      }

      // Threshold for accepting a command
      if (bestScore >= 0.7) {
        // Handle the matched command
        switch (bestMatch) {
          case 'home':
            setResponse(t('voice.responses.navigatingTo', { page: t('nav.home') }));
            navigate('/');
            break;

          case 'dashboard':
            if (user) {
              setResponse(t('voice.responses.navigatingTo', { page: t('nav.dashboard') }));
              navigate('/dashboard');
            } else {
              setResponse(t('voice.responses.loginFirst'));
            }
            break;

          case 'appointments':
          case 'bookAppointment':
            if (user) {
              setResponse(t('voice.responses.navigatingTo', { page: t('nav.appointments') }));
              navigate('/appointments/book');
            } else {
              setResponse(t('voice.responses.loginFirst'));
            }
            break;

          case 'login':
            setResponse(t('voice.responses.navigatingTo', { page: t('nav.login') }));
            navigate('/login');
            break;

          case 'profile':
            if (user) {
              setResponse(t('voice.responses.navigatingTo', { page: t('nav.profile') }));
              navigate('/profile');
            } else {
              setResponse(t('voice.responses.loginFirst'));
            }
            break;

          case 'settings':
            setResponse(t('voice.responses.navigatingTo', { page: t('nav.settings') }));
            navigate('/settings');
            break;

          case 'logout':
            if (user) {
              setResponse(t('voice.responses.loggingOut'));
              // This would typically call the logout function
              // onLogout();
            } else {
              setResponse(t('voice.responses.notLoggedIn'));
            }
            break;

          case 'changeLanguage':
            // Extract language from command
            let targetLang = null;

            Object.entries(i18n.options.resources || {}).forEach(([code, langData]) => {
              const langName = langData.translation?.language?.name?.toLowerCase();
              if (langName && lowerCommand.includes(langName)) {
                targetLang = code;
              }
            });

            if (targetLang) {
              await i18n.changeLanguage(targetLang);
              setResponse(t('voice.responses.languageChanged', { language: t(`language.${targetLang}`) }));
            } else {
              setResponse(t('voice.responses.languageNotFound'));
            }
            break;

          case 'emergency':
            setResponse(t('voice.responses.emergency'));
            // Trigger emergency flow
            // This would typically open the emergency modal
            break;

          case 'help':
            setResponse(t('voice.responses.help'));
            break;

          case 'medicalRecords':
            if (user) {
              setResponse(t('voice.responses.navigatingTo', { page: t('dashboard.actions.viewMedicalRecords') }));
              navigate('/medical-records');
            } else {
              setResponse(t('voice.responses.loginFirst'));
            }
            break;

          case 'findDoctor':
            setResponse(t('voice.responses.navigatingTo', { page: t('dashboard.actions.findDoctors') }));
            navigate('/find-doctors');
            break;

          case 'findHospital':
            setResponse(t('voice.responses.navigatingTo', { page: t('dashboard.actions.findHospitals') }));
            navigate('/find-hospitals');
            break;

          default:
            setResponse(t('voice.responses.notUnderstood'));
        }
      } else {
        // No good match found
        setResponse(t('voice.responses.notUnderstood'));
      }
    } catch (error) {
      console.error('Voice command error:', error);
      setResponse(t('voice.responses.error'));
    } finally {
      setProcessing(false);
    }
  }, [t, navigate, user, i18n, getCommandPatterns]);

  // Handle start listening
  const startListening = () => {
    resetTranscript();
    setResponse('');
    setIsListening(true);
    SpeechRecognition.startListening({ language: i18n.language });
  };

  // Handle stop listening
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    if (transcript) {
      processCommand(transcript);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Update isListening state based on actual listening state
  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  // Speak response using text-to-speech
  useEffect(() => {
    if (response && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = i18n.language;
      window.speechSynthesis.speak(utterance);
    }
  }, [response, i18n.language]);

  // Pre-compute color values
  const boxBgColor = useColorModeValue('white', 'gray.800');
  const transcriptBgColor = useColorModeValue('gray.50', 'gray.700');
  const responseBgColor = useColorModeValue('brand.50', 'brand.900');

  return (
    <AnimatePresence>
      {isActive && (
        <MotionBox
          position="fixed"
          bottom="80px"
          right="20px"
          zIndex="1000"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="xl"
            width="300px"
            overflow="hidden"
          >
            <Flex
              bg="brand.500"
              color="white"
              p={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontWeight="bold">{t('voice.assistant')}</Text>
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                color="white"
                onClick={onClose}
                aria-label="Close"
              />
            </Flex>

            <VStack p={4} spacing={4} align="stretch">
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={3}
                minHeight="100px"
                bg={transcriptBgColor}
              >
                {transcript ? (
                  <Text>{transcript}</Text>
                ) : (
                  <Text color="gray.500">
                    {isListening ? t('voice.listening') : t('voice.instructions')}
                  </Text>
                )}
              </Box>

              {processing ? (
                <HStack justifyContent="center" p={2}>
                  <Spinner size="md" color="brand.500" />
                  <Text>{t('voice.processing')}</Text>
                </HStack>
              ) : response ? (
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  bg={responseBgColor}
                >
                  <Text fontWeight="medium">{response}</Text>
                </Box>
              ) : null}

              <Flex justifyContent="center">
                <MotionFlex
                  justifyContent="center"
                  alignItems="center"
                  width="60px"
                  height="60px"
                  borderRadius="full"
                  bg={isListening ? 'red.500' : 'brand.500'}
                  color="white"
                  cursor="pointer"
                  onClick={toggleListening}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                  transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
                >
                  {isListening ? (
                    <FaMicrophoneSlash size="24px" />
                  ) : (
                    <FaMicrophone size="24px" />
                  )}
                </MotionFlex>
              </Flex>
            </VStack>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default VoiceAssistant;
