import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaAmbulance, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { emergencyApi } from '../utils/api';
import { getCurrentLocation } from '../utils/helper';

// Create a motion button component
const MotionButton = motion(Button);

const EmergencyButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emergencyRequested, setEmergencyRequested] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  
  // Handle emergency request
  const handleEmergencyRequest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      // Create emergency request
      const emergencyRequest = {
        patient_id: 'current_user_id', // This should be replaced with actual user ID
        location: location,
        symptoms: ['emergency'],
        notes: 'Emergency assistance needed',
      };
      
      const response = await emergencyApi.createEmergencyRequest(emergencyRequest);
      
      setEmergencyData(response);
      setEmergencyRequested(true);
      
      // Show success toast
      toast({
        title: t('emergency.requested'),
        description: t('emergency.onTheWay'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Emergency request error:', error);
      setError(error.detail || t('emergency.requestFailed'));
      
      // Show error toast
      toast({
        title: t('emergency.error'),
        description: error.detail || t('emergency.requestFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel emergency request
  const handleCancelEmergency = async () => {
    setLoading(true);
    
    try {
      // Cancel emergency request logic would go here
      // For now, just close the modal
      setEmergencyRequested(false);
      setEmergencyData(null);
      onClose();
      
      // Show success toast
      toast({
        title: t('emergency.cancelled'),
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Cancel emergency error:', error);
      
      // Show error toast
      toast({
        title: t('emergency.cancelError'),
        description: error.detail || t('emergency.cancelFailed'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <MotionButton
        colorScheme="emergency"
        size="lg"
        borderRadius="full"
        boxShadow="lg"
        leftIcon={<FaAmbulance />}
        onClick={onOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {t('emergency.button')}
      </MotionButton>
      
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="emergency.500" color="white" borderTopRadius="md">
            {t('emergency.title')}
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody py={6}>
            {loading ? (
              <VStack spacing={4} py={4}>
                <Spinner size="xl" color="emergency.500" thickness="4px" />
                <Text>{t('emergency.processing')}</Text>
              </VStack>
            ) : error ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>{t('emergency.error')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : emergencyRequested ? (
              <VStack spacing={4} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('emergency.onTheWay')}</AlertTitle>
                    <AlertDescription>
                      {t('emergency.eta', { minutes: '15' })}
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <HStack>
                    <FaMapMarkerAlt color="red" />
                    <Text fontWeight="bold">{t('emergency.yourLocation')}</Text>
                  </HStack>
                  <Text mt={2}>
                    {emergencyData?.address?.formatted_address || t('emergency.locationDetected')}
                  </Text>
                </Box>
                
                <Text>{t('emergency.stayCalm')}</Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Text>{t('emergency.confirmation')}</Text>
                <Text fontWeight="bold">{t('emergency.disclaimer')}</Text>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            {!loading && (
              emergencyRequested ? (
                <Button colorScheme="red" onClick={handleCancelEmergency}>
                  {t('emergency.cancel')}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    {t('common.no')}
                  </Button>
                  <Button colorScheme="emergency" onClick={handleEmergencyRequest}>
                    {t('common.yes')}
                  </Button>
                </>
              )
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmergencyButton;
