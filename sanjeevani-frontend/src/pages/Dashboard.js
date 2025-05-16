import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Avatar,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaFileMedical, FaHospital, FaUserMd } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Components
import HealthDataChart from '../components/HealthDataChart';
import HealthModel3D from '../components/HealthModel3D';

// Utils
import { getGreeting, formatDate, formatTime } from '../utils/helper';
import { appointmentsApi } from '../utils/api';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionGrid = motion(Grid);

const Dashboard = ({ user, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Pre-compute color values
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [healthData, setHealthData] = useState({
    bloodPressure: [],
    heartRate: [],
    bloodGlucose: [],
    weight: [],
  });
  const [timeRange, setTimeRange] = useState('7d');

  // For demonstration purposes, we're allowing access without authentication
  // In a real application, this would redirect to login
  useEffect(() => {
    if (!loading && !user) {
      console.log('Demo mode: Allowing access to dashboard without authentication');
      // Commented out for demo purposes
      // navigate('/login');
      // toast({
      //   title: t('auth.loginRequired'),
      //   status: 'warning',
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  }, [user, loading, navigate, t, toast]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      setAppointmentsLoading(true);
      try {
        const response = await appointmentsApi.getAppointments();
        setAppointments(response);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast({
          title: t('appointments.fetchError'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, t, toast]);

  // Generate mock health data
  useEffect(() => {
    // This would be replaced with actual API calls in a real app
    const generateMockData = () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const labels = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return date.toLocaleDateString();
      });

      // Generate random data for each health metric
      const bloodPressure = {
        labels,
        datasets: [
          {
            label: t('health.metrics.systolic'),
            data: Array.from({ length: days }, () => Math.floor(Math.random() * 40) + 100),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.3,
          },
          {
            label: t('health.metrics.diastolic'),
            data: Array.from({ length: days }, () => Math.floor(Math.random() * 30) + 60),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
          },
        ],
      };

      const heartRate = {
        labels,
        datasets: [
          {
            label: t('health.metrics.heartRate'),
            data: Array.from({ length: days }, () => Math.floor(Math.random() * 40) + 60),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            tension: 0.3,
            fill: true,
          },
        ],
      };

      const bloodGlucose = {
        labels,
        datasets: [
          {
            label: t('health.metrics.bloodGlucose'),
            data: Array.from({ length: days }, () => Math.floor(Math.random() * 100) + 70),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3,
          },
        ],
      };

      const weight = {
        labels,
        datasets: [
          {
            label: t('health.metrics.weight'),
            data: Array.from({ length: days }, () => Math.floor(Math.random() * 5) + 70),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            tension: 0.3,
          },
        ],
      };

      setHealthData({
        bloodPressure,
        heartRate,
        bloodGlucose,
        weight,
      });
    };

    generateMockData();
  }, [timeRange, t]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Loading state
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  // For demonstration purposes, we're allowing access without authentication
  // In a real application, this would return null if not authenticated
  const demoUser = user || {
    name: "Demo User",
    email: "demo@example.com",
    role: "patient"
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Greeting Section */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        mb={8}
      >
        <Heading as="h1" size="xl" mb={2}>
          {getGreeting(demoUser.name, t)}
        </Heading>
        <Text color={textColor}>
          {t('dashboard.welcomeMessage')}
        </Text>
      </MotionBox>

      {/* Quick Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stat
            p={4}
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
          >
            <StatLabel>{t('dashboard.stats.upcomingAppointments')}</StatLabel>
            <StatNumber>{appointments.filter(a => new Date(a.date) > new Date()).length || 0}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {t('dashboard.stats.nextAppointment')}
            </StatHelpText>
          </Stat>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Stat
            p={4}
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
          >
            <StatLabel>{t('dashboard.stats.bloodPressure')}</StatLabel>
            <StatNumber>120/80</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {t('dashboard.stats.normal')}
            </StatHelpText>
          </Stat>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Stat
            p={4}
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
          >
            <StatLabel>{t('dashboard.stats.heartRate')}</StatLabel>
            <StatNumber>72 BPM</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {t('dashboard.stats.normal')}
            </StatHelpText>
          </Stat>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Stat
            p={4}
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
          >
            <StatLabel>{t('dashboard.stats.bloodGlucose')}</StatLabel>
            <StatNumber>95 mg/dL</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {t('dashboard.stats.normal')}
            </StatHelpText>
          </Stat>
        </MotionBox>
      </SimpleGrid>

      {/* Health Charts */}
      <Heading as="h2" size="lg" mb={4}>
        {t('dashboard.healthMetrics')}
      </Heading>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        <GridItem>
          <HealthDataChart
            type="line"
            data={healthData.bloodPressure}
            title={t('health.charts.bloodPressure.title')}
            description={t('health.charts.bloodPressure.description')}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </GridItem>

        <GridItem>
          <HealthDataChart
            type="line"
            data={healthData.heartRate}
            title={t('health.charts.heartRate.title')}
            description={t('health.charts.heartRate.description')}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </GridItem>

        <GridItem>
          <HealthDataChart
            type="line"
            data={healthData.bloodGlucose}
            title={t('health.charts.bloodGlucose.title')}
            description={t('health.charts.bloodGlucose.description')}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </GridItem>

        <GridItem>
          <HealthDataChart
            type="line"
            data={healthData.weight}
            title={t('health.charts.weight.title')}
            description={t('health.charts.weight.description')}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </GridItem>
      </Grid>

      {/* 3D Health Visualizations */}
      <Heading as="h2" size="lg" mb={4}>
        {t('dashboard.healthVisualizations')}
      </Heading>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap={6} mb={8}>
        <GridItem>
          <Box
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            p={4}
          >
            <Heading as="h3" size="md" mb={2}>
              {t('health.models.heart.title')}
            </Heading>
            <Text fontSize="sm" color={textColor} mb={4}>
              {t('health.models.heart.description')}
            </Text>
            <HealthModel3D modelType="heart" heartRate={72} height={250} />
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            p={4}
          >
            <Heading as="h3" size="md" mb={2}>
              {t('health.models.lungs.title')}
            </Heading>
            <Text fontSize="sm" color={textColor} mb={4}>
              {t('health.models.lungs.description')}
            </Text>
            <HealthModel3D modelType="lungs" breathingRate={16} height={250} />
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg={boxBgColor}
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            p={4}
          >
            <Heading as="h3" size="md" mb={2}>
              {t('health.models.brain.title')}
            </Heading>
            <Text fontSize="sm" color={textColor} mb={4}>
              {t('health.models.brain.description')}
            </Text>
            <HealthModel3D modelType="brain" brainActivity={0.7} height={250} />
          </Box>
        </GridItem>
      </Grid>

      {/* Upcoming Appointments */}
      <Heading as="h2" size="lg" mb={4}>
        {t('dashboard.upcomingAppointments')}
      </Heading>

      {appointmentsLoading ? (
        <Flex justify="center" py={8}>
          <Spinner size="lg" color="brand.500" />
        </Flex>
      ) : appointments.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
          {appointments.slice(0, 4).map((appointment, index) => (
            <MotionBox
              key={appointment.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">
                      {appointment.doctorName || 'Dr. Smith'}
                    </Heading>
                    <Badge colorScheme={
                      appointment.status === 'confirmed' ? 'green' :
                      appointment.status === 'pending' ? 'yellow' :
                      appointment.status === 'cancelled' ? 'red' : 'blue'
                    }>
                      {appointment.status || 'Confirmed'}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody py={2}>
                  <Flex align="center" mb={2}>
                    <FaCalendarAlt color="brand.500" />
                    <Text ml={2}>
                      {formatDate(appointment.date)} at {formatTime(appointment.date)}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <FaHospital color="brand.500" />
                    <Text ml={2}>
                      {appointment.hospitalName || 'City Hospital'}
                    </Text>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="brand" size="sm">
                    {t('dashboard.viewDetails')}
                  </Button>
                </CardFooter>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>
      ) : (
        <Box
          p={6}
          bg={boxBgColor}
          borderRadius="lg"
          borderWidth="1px"
          textAlign="center"
          mb={8}
        >
          <Text mb={4}>{t('dashboard.noAppointments')}</Text>
          <Button
            as="a"
            href="/appointments/book"
            colorScheme="brand"
          >
            {t('dashboard.bookAppointment')}
          </Button>
        </Box>
      )}

      {/* Quick Actions */}
      <Heading as="h2" size="lg" mb={4}>
        {t('dashboard.quickActions')}
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
        <Button
          as="a"
          href="/appointments/book"
          size="lg"
          height="100px"
          colorScheme="brand"
          leftIcon={<FaCalendarAlt />}
        >
          {t('dashboard.actions.bookAppointment')}
        </Button>

        <Button
          as="a"
          href="/medical-records"
          size="lg"
          height="100px"
          colorScheme="teal"
          variant="outline"
          leftIcon={<FaFileMedical />}
        >
          {t('dashboard.actions.viewMedicalRecords')}
        </Button>

        <Button
          as="a"
          href="/doctors"
          size="lg"
          height="100px"
          colorScheme="purple"
          variant="outline"
          leftIcon={<FaUserMd />}
        >
          {t('dashboard.actions.findDoctors')}
        </Button>

        <Button
          as="a"
          href="/hospitals"
          size="lg"
          height="100px"
          colorScheme="blue"
          variant="outline"
          leftIcon={<FaHospital />}
        >
          {t('dashboard.actions.findHospitals')}
        </Button>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;