import React from 'react';
import {
  Box,
  Text,
  Flex,
  Icon,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DemoBanner = () => {
  const bgColor = useColorModeValue('blue.500', 'blue.600');
  const textColor = useColorModeValue('white', 'white');
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="banner"
      bg={bgColor}
      color={textColor}
      py={2}
      px={4}
      textAlign="center"
    >
      <Flex align="center" justify="center">
        <Icon as={FaInfoCircle} mr={2} />
        <Text fontWeight="medium">
          Demo Mode: No backend server required. All data is simulated.
          <Link
            href="https://github.com/yourusername/sanjeevani"
            isExternal
            ml={2}
            textDecoration="underline"
          >
            Learn more
          </Link>
        </Text>
      </Flex>
    </MotionBox>
  );
};

export default DemoBanner;
