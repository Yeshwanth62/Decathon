import React from 'react';
import { Box, Heading, Text, VStack, HStack, Badge, Divider } from '@chakra-ui/react';
import { testEnvironmentVariables } from '../utils/envTest';

/**
 * Component to display environment variable test results
 * Only use this component in development mode
 */
const EnvTestDisplay = () => {
  const results = testEnvironmentVariables();

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      bg="white"
      maxW="800px"
      mx="auto"
      my={5}
    >
      <Heading size="lg" mb={4}>Environment Variables Test</Heading>
      <Text mb={4}>
        This component displays the current environment variables loaded in the application.
        It should only be used in development mode.
      </Text>

      <VStack align="stretch" spacing={4} divider={<Divider />}>
        {/* API Configuration */}
        <Box>
          <Heading size="md" mb={2}>API Configuration</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">API URL:</Text>
              <Text>{results.api.apiUrl || 'Not configured'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Socket URL:</Text>
              <Text>{results.api.socketUrl || 'Not configured'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Socket Server URL:</Text>
              <Text>{results.api.socketServerUrl || 'Not configured'}</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Feature Flags */}
        <Box>
          <Heading size="md" mb={2}>Feature Flags</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">Voice Commands:</Text>
              <Badge colorScheme={results.featureFlags.enableVoiceCommands === 'true' ? 'green' : 'red'}>
                {results.featureFlags.enableVoiceCommands === 'true' ? 'Enabled' : 'Disabled'}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">3D Models:</Text>
              <Badge colorScheme={results.featureFlags.enable3DModels === 'true' ? 'green' : 'red'}>
                {results.featureFlags.enable3DModels === 'true' ? 'Enabled' : 'Disabled'}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Emergency:</Text>
              <Badge colorScheme={results.featureFlags.enableEmergency === 'true' ? 'green' : 'red'}>
                {results.featureFlags.enableEmergency === 'true' ? 'Enabled' : 'Disabled'}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">3D Quality:</Text>
              <Badge colorScheme="blue">{results.featureFlags.max3DQuality || 'Not configured'}</Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Analytics */}
        <Box>
          <Heading size="md" mb={2}>Analytics</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">Google Analytics ID:</Text>
              <Badge colorScheme={results.analytics.googleAnalyticsId ? 'green' : 'red'}>
                {results.analytics.googleAnalyticsId ? 'Configured' : 'Not configured'}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">GA Tracking ID:</Text>
              <Badge colorScheme={results.analytics.gaTrackingId ? 'green' : 'red'}>
                {results.analytics.gaTrackingId ? 'Configured' : 'Not configured'}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Firebase */}
        <Box>
          <Heading size="md" mb={2}>Firebase</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">API Key:</Text>
              <Badge colorScheme={results.firebase.apiKey === 'Configured' ? 'green' : 'red'}>
                {results.firebase.apiKey}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Auth Domain:</Text>
              <Badge colorScheme={results.firebase.authDomain === 'Configured' ? 'green' : 'red'}>
                {results.firebase.authDomain}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Project ID:</Text>
              <Badge colorScheme={results.firebase.projectId === 'Configured' ? 'green' : 'red'}>
                {results.firebase.projectId}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Storage Bucket:</Text>
              <Badge colorScheme={results.firebase.storageBucket === 'Configured' ? 'green' : 'red'}>
                {results.firebase.storageBucket}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">Messaging Sender ID:</Text>
              <Badge colorScheme={results.firebase.messagingSenderId === 'Configured' ? 'green' : 'red'}>
                {results.firebase.messagingSenderId}
              </Badge>
            </HStack>
            <HStack>
              <Text fontWeight="bold" minW="150px">App ID:</Text>
              <Badge colorScheme={results.firebase.appId === 'Configured' ? 'green' : 'red'}>
                {results.firebase.appId}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Error Tracking */}
        <Box>
          <Heading size="md" mb={2}>Error Tracking</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">Sentry DSN:</Text>
              <Badge colorScheme={results.errorTracking.sentryDsn === 'Configured' ? 'green' : 'red'}>
                {results.errorTracking.sentryDsn}
              </Badge>
            </HStack>
          </VStack>
        </Box>

        {/* Maps */}
        <Box>
          <Heading size="md" mb={2}>Maps</Heading>
          <VStack align="stretch" spacing={1}>
            <HStack>
              <Text fontWeight="bold" minW="150px">Google Maps API Key:</Text>
              <Badge colorScheme={results.maps.googleMapsApiKey === 'Configured' ? 'green' : 'red'}>
                {results.maps.googleMapsApiKey}
              </Badge>
            </HStack>
          </VStack>
        </Box>
      </VStack>

      <Text mt={4} fontSize="sm" color="gray.500">
        Note: This component should only be used in development mode. Remove it from production builds.
      </Text>
    </Box>
  );
};

export default EnvTestDisplay;
