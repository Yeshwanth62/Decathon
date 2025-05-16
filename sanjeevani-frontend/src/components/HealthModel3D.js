import React, { useState, useEffect } from 'react';
import {
  Box,
  Spinner,
  Text,
  useColorModeValue,
  Image,
  Flex,
  Heading,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);

// Device detection for optimization
const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };

    checkDevice();

    // Add resize listener to detect orientation changes
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Heart visualization component
const HeartVisualization = ({ bpm = 72 }) => {
  const [scale, setScale] = useState(1);

  // Simple pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => prev === 1 ? 1.1 : 1);
    }, 60000 / bpm); // Convert BPM to milliseconds

    return () => clearInterval(interval);
  }, [bpm]);

  return (
    <Flex direction="column" align="center" justify="center" h="100%" position="relative">
      <MotionBox
        animate={{ scale: scale }}
        transition={{ duration: 0.2 }}
        mb={4}
      >
        <Image
          src="/images/heart.svg"
          fallbackSrc="/images/heart.svg"
          alt="Heart"
          boxSize="150px"
        />
      </MotionBox>
      <Badge colorScheme="red" fontSize="lg" p={2}>
        {bpm} BPM
      </Badge>
    </Flex>
  );
};

// Lungs visualization component
const LungsVisualization = ({ breathingRate = 16 }) => {
  const [scale, setScale] = useState(1);

  // Simple breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScale(prev => prev === 1 ? 1.1 : 1);
    }, 60000 / breathingRate); // Convert breathing rate to milliseconds

    return () => clearInterval(interval);
  }, [breathingRate]);

  return (
    <Flex direction="column" align="center" justify="center" h="100%" position="relative">
      <MotionBox
        animate={{ scale: scale }}
        transition={{ duration: 1 }}
        mb={4}
      >
        <Image
          src="/images/lungs.svg"
          fallbackSrc="/images/lungs.svg"
          alt="Lungs"
          boxSize="150px"
        />
      </MotionBox>
      <Badge colorScheme="purple" fontSize="lg" p={2}>
        {breathingRate} breaths/min
      </Badge>
    </Flex>
  );
};

// Brain visualization component
const BrainVisualization = ({ activity = 0.7 }) => {
  const [opacity, setOpacity] = useState(0.5);

  // Simple activity animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prev => prev === 0.5 ? 0.8 : 0.5);
    }, 1000); // Pulse every second

    return () => clearInterval(interval);
  }, []);

  return (
    <Flex direction="column" align="center" justify="center" h="100%" position="relative">
      <MotionBox
        animate={{ opacity: opacity * activity + 0.3 }}
        transition={{ duration: 0.5 }}
        mb={4}
      >
        <Image
          src="/images/brain.svg"
          fallbackSrc="/images/brain.svg"
          alt="Brain"
          boxSize="150px"
        />
      </MotionBox>
      <Badge colorScheme="blue" fontSize="lg" p={2}>
        Activity: {Math.round(activity * 100)}%
      </Badge>
    </Flex>
  );
};



// Main component
const HealthModel3D = ({
  modelType = 'heart',
  height = 300,
  heartRate = 72,
  breathingRate = 16,
  brainActivity = 0.7,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue('#f7fafc', '#1a202c');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        height={`${height}px`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        {...props}
      >
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      height={`${height}px`}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      {...props}
    >
      {modelType === 'heart' && <HeartVisualization bpm={heartRate} />}
      {modelType === 'lungs' && <LungsVisualization breathingRate={breathingRate} />}
      {modelType === 'brain' && <BrainVisualization activity={brainActivity} />}
    </MotionBox>
  );
};

export default HealthModel3D;
