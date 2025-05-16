import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Badge,
  useColorModeValue,
  Spinner,
  Divider,
  HStack,
  VStack,
  Radio,
  RadioGroup,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd, FaHospital, FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Utils
import { formatDate, formatTime } from '../utils/helper';
import { appointmentsApi, doctorsApi, hospitalsApi } from '../utils/api';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const AppointmentBooking = ({ user, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Pre-compute color values
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const detailsBgColor = useColorModeValue('gray.50', 'gray.700');
  const confirmationBgColor = useColorModeValue('brand.50', 'brand.900');

  // Stepper state
  const steps = [
    { title: t('appointment.steps.search'), description: t('appointment.steps.searchDesc') },
    { title: t('appointment.steps.select'), description: t('appointment.steps.selectDesc') },
    { title: t('appointment.steps.details'), description: t('appointment.steps.detailsDesc') },
    { title: t('appointment.steps.confirm'), description: t('appointment.steps.confirmDesc') },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  // Form states
  const [searchFilters, setSearchFilters] = useState({
    specialty: '',
    location: '',
    date: '',
    appointmentType: 'in_person',
  });

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    reason: '',
    symptoms: '',
    notes: '',
  });

  // Loading states
  const [searchLoading, setSearchLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // For demonstration purposes, we're allowing access without authentication
  // In a real application, this would redirect to login
  useEffect(() => {
    if (!loading && !user) {
      console.log('Demo mode: Allowing access to appointment booking without authentication');
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

  // Handle search filters change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search
  const handleSearch = async () => {
    setSearchLoading(true);

    try {
      // In a real app, this would call the API with filters
      // For now, we'll generate mock data
      const mockDoctors = generateMockDoctors();
      setDoctors(mockDoctors);

      // Move to next step
      setActiveStep(1);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: t('appointment.searchError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Generate mock doctors
  const generateMockDoctors = () => {
    const specialties = [
      'Cardiologist',
      'Dermatologist',
      'Neurologist',
      'Pediatrician',
      'Orthopedic Surgeon',
    ];

    const hospitals = [
      'City Hospital',
      'General Medical Center',
      'Community Health',
      'Memorial Hospital',
      'University Medical',
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: `doctor-${i + 1}`,
      name: `Dr. ${['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'][i]}`,
      specialty: specialties[i % specialties.length],
      hospital: hospitals[i % hospitals.length],
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3 and 5
      experience: Math.floor(Math.random() * 20) + 5, // Random experience between 5 and 25 years
      fee: Math.floor(Math.random() * 100) + 50, // Random fee between 50 and 150
      availableSlots: generateTimeSlots(),
      image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 1}.jpg`,
    }));
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();

    // Generate slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Generate 3-5 random time slots for each day
      const numSlots = Math.floor(Math.random() * 3) + 3;
      const daySlots = [];

      for (let j = 0; j < numSlots; j++) {
        const hour = Math.floor(Math.random() * 8) + 9; // Random hour between 9 AM and 5 PM
        const minute = [0, 30][Math.floor(Math.random() * 2)]; // Either 0 or 30 minutes

        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        daySlots.push({
          id: `slot-${i}-${j}`,
          time: slotTime,
          available: true,
        });
      }

      // Sort slots by time
      daySlots.sort((a, b) => a.time - b.time);

      slots.push({
        date,
        slots: daySlots,
      });
    }

    return slots;
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setActiveStep(2);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  // Handle appointment details change
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle continue to confirmation
  const handleContinueToConfirmation = () => {
    if (!selectedTimeSlot) {
      toast({
        title: t('appointment.selectTimeSlot'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveStep(3);
  };

  // Handle book appointment
  const handleBookAppointment = async () => {
    setBookingLoading(true);

    try {
      // In a real app, this would call the API to book the appointment
      // For now, we'll simulate a successful booking

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t('appointment.bookingSuccess'),
        description: t('appointment.bookingSuccessDesc'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: t('appointment.bookingError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBookingLoading(false);
    }
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

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderSearchStep();
      case 1:
        return renderSelectDoctorStep();
      case 2:
        return renderAppointmentDetailsStep();
      case 3:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  // Render search step
  const renderSearchStep = () => {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <Heading size="md">{t('appointment.searchTitle')}</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>{t('appointment.specialty')}</FormLabel>
                <Select
                  name="specialty"
                  value={searchFilters.specialty}
                  onChange={handleFilterChange}
                  placeholder={t('appointment.selectSpecialty')}
                >
                  <option value="cardiologist">{t('appointment.specialties.cardiologist')}</option>
                  <option value="dermatologist">{t('appointment.specialties.dermatologist')}</option>
                  <option value="neurologist">{t('appointment.specialties.neurologist')}</option>
                  <option value="pediatrician">{t('appointment.specialties.pediatrician')}</option>
                  <option value="orthopedic">{t('appointment.specialties.orthopedic')}</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t('appointment.location')}</FormLabel>
                <Input
                  name="location"
                  value={searchFilters.location}
                  onChange={handleFilterChange}
                  placeholder={t('appointment.enterLocation')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('appointment.date')}</FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={searchFilters.date}
                  onChange={handleFilterChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('appointment.type')}</FormLabel>
                <RadioGroup
                  name="appointmentType"
                  value={searchFilters.appointmentType}
                  onChange={(value) => handleFilterChange({ target: { name: 'appointmentType', value } })}
                >
                  <Stack direction="row">
                    <Radio value="in_person">{t('appointment.types.inPerson')}</Radio>
                    <Radio value="telemedicine">{t('appointment.types.telemedicine')}</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Stack>
          </CardBody>
          <CardFooter>
            <Button
              colorScheme="brand"
              leftIcon={<FaSearch />}
              onClick={handleSearch}
              isLoading={searchLoading}
              loadingText={t('appointment.searching')}
            >
              {t('appointment.search')}
            </Button>
          </CardFooter>
        </Card>
      </MotionBox>
    );
  };

  // Render select doctor step
  const renderSelectDoctorStep = () => {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={6}>
          <Heading size="md" mb={4}>{t('appointment.selectDoctor')}</Heading>
          <Text color={textColor}>
            {t('appointment.foundDoctors', { count: doctors.length })}
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {doctors.map((doctor) => (
            <MotionBox
              key={doctor.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                cursor="pointer"
                onClick={() => handleDoctorSelect(doctor)}
                borderWidth="1px"
                borderColor={selectedDoctor?.id === doctor.id ? 'brand.500' : 'transparent'}
                boxShadow={selectedDoctor?.id === doctor.id ? 'md' : 'sm'}
              >
                <CardHeader>
                  <Flex>
                    <Avatar src={doctor.image} name={doctor.name} size="lg" mr={4} />
                    <Box>
                      <Heading size="md">{doctor.name}</Heading>
                      <Text color={textColor}>
                        {doctor.specialty}
                      </Text>
                      <HStack mt={1}>
                        <Badge colorScheme="green">{doctor.rating} ★</Badge>
                        <Badge colorScheme="purple">{doctor.experience} {t('appointment.yearsExp')}</Badge>
                      </HStack>
                    </Box>
                  </Flex>
                </CardHeader>
                <CardBody py={2}>
                  <Flex align="center" mb={2}>
                    <FaHospital color="brand.500" />
                    <Text ml={2}>{doctor.hospital}</Text>
                  </Flex>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <FaCalendarAlt color="brand.500" />
                      <Text ml={2}>
                        {doctor.availableSlots[0].slots.length} {t('appointment.availableSlots')}
                      </Text>
                    </Flex>
                    <Text fontWeight="bold">
                      ${doctor.fee}
                    </Text>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme="brand"
                    size="sm"
                    width="full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDoctorSelect(doctor);
                    }}
                  >
                    {t('appointment.selectAndContinue')}
                  </Button>
                </CardFooter>
              </Card>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Flex justify="space-between" mt={8}>
          <Button
            variant="outline"
            onClick={() => setActiveStep(0)}
          >
            {t('appointment.back')}
          </Button>
        </Flex>
      </MotionBox>
    );
  };

  // Render appointment details step
  const renderAppointmentDetailsStep = () => {
    if (!selectedDoctor) {
      return null;
    }

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={6}>
          <Heading size="md" mb={4}>{t('appointment.selectTimeAndDetails')}</Heading>
          <Flex align="center" mb={4}>
            <Avatar src={selectedDoctor.image} name={selectedDoctor.name} size="md" mr={4} />
            <Box>
              <Heading size="sm">{selectedDoctor.name}</Heading>
              <Text color={textColor}>
                {selectedDoctor.specialty} • {selectedDoctor.hospital}
              </Text>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Time Slots */}
          <Box>
            <Heading size="sm" mb={4}>{t('appointment.availableTimeSlots')}</Heading>

            <Tabs variant="soft-rounded" colorScheme="brand" isLazy>
              <TabList overflowX="auto" py={2}>
                {selectedDoctor.availableSlots.map((daySlot, index) => (
                  <Tab key={index} whiteSpace="nowrap">
                    {formatDate(daySlot.date)}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {selectedDoctor.availableSlots.map((daySlot, dayIndex) => (
                  <TabPanel key={dayIndex} px={0}>
                    <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
                      {daySlot.slots.map((slot) => (
                        <Button
                          key={slot.id}
                          size="sm"
                          variant={selectedTimeSlot?.id === slot.id ? 'solid' : 'outline'}
                          colorScheme={selectedTimeSlot?.id === slot.id ? 'brand' : 'gray'}
                          onClick={() => handleTimeSlotSelect(slot)}
                          isDisabled={!slot.available}
                        >
                          {formatTime(slot.time)}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>

          {/* Appointment Details */}
          <Box>
            <Heading size="sm" mb={4}>{t('appointment.appointmentDetails')}</Heading>

            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('appointment.reasonForVisit')}</FormLabel>
                <Input
                  name="reason"
                  value={appointmentDetails.reason}
                  onChange={handleDetailsChange}
                  placeholder={t('appointment.reasonPlaceholder')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('appointment.symptoms')}</FormLabel>
                <Textarea
                  name="symptoms"
                  value={appointmentDetails.symptoms}
                  onChange={handleDetailsChange}
                  placeholder={t('appointment.symptomsPlaceholder')}
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('appointment.additionalNotes')}</FormLabel>
                <Textarea
                  name="notes"
                  value={appointmentDetails.notes}
                  onChange={handleDetailsChange}
                  placeholder={t('appointment.notesPlaceholder')}
                  rows={3}
                />
              </FormControl>
            </Stack>
          </Box>
        </SimpleGrid>

        <Flex justify="space-between" mt={8}>
          <Button
            variant="outline"
            onClick={() => setActiveStep(1)}
          >
            {t('appointment.back')}
          </Button>

          <Button
            colorScheme="brand"
            onClick={handleContinueToConfirmation}
            isDisabled={!selectedTimeSlot || !appointmentDetails.reason}
          >
            {t('appointment.continue')}
          </Button>
        </Flex>
      </MotionBox>
    );
  };

  // Render confirmation step
  const renderConfirmationStep = () => {
    if (!selectedDoctor || !selectedTimeSlot) {
      return null;
    }

    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={6}>
          <Heading size="md" mb={4}>{t('appointment.confirmAppointment')}</Heading>
          <Text color={textColor}>
            {t('appointment.reviewDetails')}
          </Text>
        </Box>

        <Card mb={6}>
          <CardHeader bg={confirmationBgColor} borderTopRadius="md">
            <Heading size="md">{t('appointment.appointmentSummary')}</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4} divider={<Divider />}>
              <Flex>
                <Avatar src={selectedDoctor.image} name={selectedDoctor.name} size="lg" mr={4} />
                <Box>
                  <Heading size="md">{selectedDoctor.name}</Heading>
                  <Text color={textColor}>
                    {selectedDoctor.specialty}
                  </Text>
                  <HStack mt={1}>
                    <Badge colorScheme="green">{selectedDoctor.rating} ★</Badge>
                    <Badge colorScheme="purple">{selectedDoctor.experience} {t('appointment.yearsExp')}</Badge>
                  </HStack>
                </Box>
              </Flex>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    <FaCalendarAlt style={{ display: 'inline', marginRight: '8px' }} />
                    {t('appointment.date')}
                  </Text>
                  <Text>{formatDate(selectedTimeSlot.time)}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    <FaClock style={{ display: 'inline', marginRight: '8px' }} />
                    {t('appointment.time')}
                  </Text>
                  <Text>{formatTime(selectedTimeSlot.time)}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    <FaHospital style={{ display: 'inline', marginRight: '8px' }} />
                    {t('appointment.hospital')}
                  </Text>
                  <Text>{selectedDoctor.hospital}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={1}>
                    <FaMapMarkerAlt style={{ display: 'inline', marginRight: '8px' }} />
                    {t('appointment.appointmentType')}
                  </Text>
                  <Text>
                    {searchFilters.appointmentType === 'in_person'
                      ? t('appointment.types.inPerson')
                      : t('appointment.types.telemedicine')}
                  </Text>
                </Box>
              </SimpleGrid>

              <Box>
                <Text fontWeight="bold" mb={1}>{t('appointment.reasonForVisit')}</Text>
                <Text>{appointmentDetails.reason}</Text>
              </Box>

              {appointmentDetails.symptoms && (
                <Box>
                  <Text fontWeight="bold" mb={1}>{t('appointment.symptoms')}</Text>
                  <Text>{appointmentDetails.symptoms}</Text>
                </Box>
              )}

              {appointmentDetails.notes && (
                <Box>
                  <Text fontWeight="bold" mb={1}>{t('appointment.additionalNotes')}</Text>
                  <Text>{appointmentDetails.notes}</Text>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb={1}>{t('appointment.consultationFee')}</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.500">
                  ${selectedDoctor.fee}
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>

        <Flex justify="space-between">
          <Button
            variant="outline"
            onClick={() => setActiveStep(2)}
          >
            {t('appointment.back')}
          </Button>

          <Button
            colorScheme="brand"
            onClick={handleBookAppointment}
            isLoading={bookingLoading}
            loadingText={t('appointment.booking')}
          >
            {t('appointment.confirmBooking')}
          </Button>
        </Flex>
      </MotionBox>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Stepper */}
      <Stepper index={activeStep} mb={8} colorScheme="brand">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {renderStepContent()}
    </Container>
  );
};

export default AppointmentBooking;