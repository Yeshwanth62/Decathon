import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHospital, FaUserMd, FaAmbulance, FaMobile } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const Home = () => {
  const { t } = useTranslation();

  // Pre-compute color values
  const heroBgColor = useColorModeValue('brand.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const textColorHero = useColorModeValue('gray.600', 'gray.300');
  const featureBgColor = useColorModeValue('white', 'gray.800');
  const ctaBgColor = useColorModeValue('brand.500', 'brand.600');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Feature items
  const features = [
    {
      icon: FaUserMd,
      title: t('home.features.appointments.title'),
      description: t('home.features.appointments.description'),
    },
    {
      icon: FaHospital,
      title: t('home.features.hospitals.title'),
      description: t('home.features.hospitals.description'),
    },
    {
      icon: FaAmbulance,
      title: t('home.features.emergency.title'),
      description: t('home.features.emergency.description'),
    },
    {
      icon: FaMobile,
      title: t('home.features.multilingual.title'),
      description: t('home.features.multilingual.description'),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={heroBgColor}
        pt={{ base: 20, md: 28 }}
        pb={{ base: 16, md: 24 }}
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <MotionFlex
              direction="column"
              justify="center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <MotionHeading
                as="h1"
                size="2xl"
                mb={4}
                variants={itemVariants}
                color="brand.600"
              >
                {t('home.hero.title')}
              </MotionHeading>

              <MotionText
                fontSize="xl"
                mb={6}
                variants={itemVariants}
                color={textColorHero}
              >
                {t('home.hero.subtitle')}
              </MotionText>

              <MotionBox variants={itemVariants}>
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    colorScheme="brand"
                    px={8}
                  >
                    {t('home.hero.getStarted')}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/appointments/book"
                    size="lg"
                    colorScheme="brand"
                    variant="outline"
                    px={8}
                  >
                    {t('home.hero.bookAppointment')}
                  </Button>
                </Stack>
              </MotionBox>
            </MotionFlex>

            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/assets/hero-image.png"
                alt="Healthcare"
                fallbackSrc="/images/placeholder.svg"
                borderRadius="lg"
                shadow="2xl"
              />
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl">
          <MotionBox
            textAlign="center"
            mb={12}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h2" size="xl" mb={4}>
              {t('home.features.title')}
            </Heading>
            <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
              {t('home.features.subtitle')}
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                bg={featureBgColor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <Flex
                  w={12}
                  h={12}
                  align="center"
                  justify="center"
                  color="white"
                  rounded="full"
                  bg="brand.500"
                  mb={4}
                >
                  <Icon as={feature.icon} fontSize="24px" />
                </Flex>
                <Heading as="h3" size="md" mb={2}>
                  {feature.title}
                </Heading>
                <Text color={textColor}>
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={ctaBgColor} color="white" py={12}>
        <Container maxW="container.xl">
          <MotionFlex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box mb={{ base: 6, md: 0 }}>
              <Heading as="h2" size="xl" mb={2}>
                {t('home.cta.title')}
              </Heading>
              <Text fontSize="lg">
                {t('home.cta.subtitle')}
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              bg="white"
              color="brand.500"
              _hover={{ bg: 'gray.100' }}
              px={8}
            >
              {t('home.cta.button')}
            </Button>
          </MotionFlex>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;