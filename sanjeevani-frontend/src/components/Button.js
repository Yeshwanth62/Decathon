import React from 'react';
import { Button as ChakraButton, forwardRef } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// Create a motion button component
const MotionButton = motion(ChakraButton);

// Custom button component with animation
const Button = forwardRef((props, ref) => {
  const {
    children,
    isLoading,
    loadingText,
    colorScheme = 'brand',
    variant = 'solid',
    size = 'md',
    isFullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    isDisabled,
    type = 'button',
    ...rest
  } = props;

  return (
    <MotionButton
      ref={ref}
      colorScheme={colorScheme}
      variant={variant}
      size={size}
      isFullWidth={isFullWidth}
      isLoading={isLoading}
      loadingText={loadingText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onClick={onClick}
      isDisabled={isDisabled}
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {children}
    </MotionButton>
  );
});

// Emergency button component
export const EmergencyButton = forwardRef((props, ref) => {
  const {
    children = 'Emergency',
    colorScheme = 'red',
    size = 'lg',
    ...rest
  } = props;

  return (
    <MotionButton
      ref={ref}
      colorScheme={colorScheme}
      size={size}
      borderRadius="full"
      boxShadow="lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {children}
    </MotionButton>
  );
});

export default Button;