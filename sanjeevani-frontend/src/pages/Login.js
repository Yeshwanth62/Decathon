import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { login, register, sendOTP, verifyOTP } from '../utils/auth';
import { supportedLanguages } from '../i18n';

// Create motion components
const MotionBox = motion(Box);

const Login = ({ setUser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [role, setRole] = useState('patient');

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Error states
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [otpError, setOtpError] = useState('');

  // Form validation
  const validateLogin = () => {
    if (!loginEmail) return t('auth.errors.emailRequired');
    if (!loginPassword) return t('auth.errors.passwordRequired');
    return '';
  };

  const validateRegister = () => {
    if (!registerName) return t('auth.errors.nameRequired');
    if (!registerEmail) return t('auth.errors.emailRequired');
    if (!registerPhone) return t('auth.errors.phoneRequired');
    if (!registerPassword) return t('auth.errors.passwordRequired');
    if (registerPassword !== confirmPassword) return t('auth.errors.passwordMismatch');
    if (registerPassword.length < 8) return t('auth.errors.passwordLength');
    return '';
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form
    const error = validateLogin();
    if (error) {
      setLoginError(error);
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const user = await login(loginEmail, loginPassword);
      setUser(user);

      toast({
        title: t('auth.loginSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Check if it's a network error (backend not available)
      if (error.message && error.message.includes('NetworkError') ||
          error.message && error.message.includes('Failed to fetch') ||
          !error.detail && error.name === 'TypeError') {
        setLoginError(t('auth.errors.serverUnavailable'));
      } else {
        setLoginError(error.detail || t('auth.errors.loginFailed'));
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    const error = validateRegister();
    if (error) {
      setRegisterError(error);
      return;
    }

    // If OTP not sent yet, send OTP first
    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    // If OTP not verified yet, verify OTP first
    if (!otpVerified) {
      await handleVerifyOTP();
      return;
    }

    setRegisterLoading(true);
    setRegisterError('');

    try {
      // Register user
      await register({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        preferred_language: preferredLanguage,
        role: role,
      });

      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.loginNow'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form and switch to login tab
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPhone('');
      setRegisterPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);

      // Switch to login tab
      document.getElementById('login-tab').click();
    } catch (error) {
      console.error('Register error:', error);
      // Check if it's a network error (backend not available)
      if (error.message && error.message.includes('NetworkError') ||
          error.message && error.message.includes('Failed to fetch') ||
          !error.detail && error.name === 'TypeError') {
        setRegisterError(t('auth.errors.serverUnavailable'));
      } else {
        setRegisterError(error.detail || t('auth.errors.registerFailed'));
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    if (!registerPhone) {
      setOtpError(t('auth.errors.phoneRequired'));
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      await sendOTP(registerPhone);
      setOtpSent(true);

      toast({
        title: t('auth.otpSent'),
        description: t('auth.otpSentDescription'),
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Send OTP error:', error);
      // Check if it's a network error (backend not available)
      if (error.message && error.message.includes('NetworkError') ||
          error.message && error.message.includes('Failed to fetch') ||
          !error.detail && error.name === 'TypeError') {
        setOtpError(t('auth.errors.serverUnavailable'));
      } else {
        setOtpError(error.detail || t('auth.errors.otpSendFailed'));
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError(t('auth.errors.otpRequired'));
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      await verifyOTP(registerPhone, otp);
      setOtpVerified(true);

      toast({
        title: t('auth.otpVerified'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      // Check if it's a network error (backend not available)
      if (error.message && error.message.includes('NetworkError') ||
          error.message && error.message.includes('Failed to fetch') ||
          !error.detail && error.name === 'TypeError') {
        setOtpError(t('auth.errors.serverUnavailable'));
      } else {
        setOtpError(error.detail || t('auth.errors.otpVerifyFailed'));
      }
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={{ base: 8, md: 12 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={{ base: 6, md: 8 }}
          borderRadius="lg"
          boxShadow="xl"
        >
          <Heading as="h1" size="xl" textAlign="center" mb={6}>
            {t('auth.welcome')}
          </Heading>

          <Tabs isFitted variant="enclosed" colorScheme="brand">
            <TabList mb="1em">
              <Tab id="login-tab">{t('auth.login')}</Tab>
              <Tab>{t('auth.register')}</Tab>
            </TabList>
            <TabPanels>
              {/* Login Tab */}
              <TabPanel>
                <form onSubmit={handleLogin}>
                  <Stack spacing={4}>
                    <FormControl isRequired isInvalid={!!loginError}>
                      <FormLabel>{t('auth.email')}</FormLabel>
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                      />
                    </FormControl>

                    <FormControl isRequired isInvalid={!!loginError}>
                      <FormLabel>{t('auth.password')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={t('auth.passwordPlaceholder')}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                            icon={showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                            variant="ghost"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {loginError && <FormErrorMessage>{loginError}</FormErrorMessage>}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      isLoading={loginLoading}
                      loadingText={t('auth.loggingIn')}
                      width="100%"
                    >
                      {t('auth.login')}
                    </Button>

                    <Divider my={4} />

                    <Text textAlign="center" mb={2}>
                      {t('auth.orLoginWith')}
                    </Text>

                    <Flex gap={4}>
                      <Button
                        leftIcon={<FaGoogle />}
                        colorScheme="red"
                        variant="outline"
                        flex="1"
                      >
                        Google
                      </Button>
                      <Button
                        leftIcon={<FaFacebook />}
                        colorScheme="facebook"
                        variant="outline"
                        flex="1"
                      >
                        Facebook
                      </Button>
                    </Flex>
                  </Stack>
                </form>
              </TabPanel>

              {/* Register Tab */}
              <TabPanel>
                <form onSubmit={handleRegister}>
                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>{t('auth.name')}</FormLabel>
                      <Input
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder={t('auth.namePlaceholder')}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>{t('auth.email')}</FormLabel>
                      <Input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>{t('auth.phone')}</FormLabel>
                      <Input
                        type="tel"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        placeholder={t('auth.phonePlaceholder')}
                      />
                    </FormControl>

                    {otpSent && !otpVerified && (
                      <FormControl isRequired isInvalid={!!otpError}>
                        <FormLabel>{t('auth.otp')}</FormLabel>
                        <Input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder={t('auth.otpPlaceholder')}
                        />
                        {otpError && <FormErrorMessage>{otpError}</FormErrorMessage>}
                        <Button
                          mt={2}
                          size="sm"
                          variant="outline"
                          onClick={handleVerifyOTP}
                          isLoading={otpLoading}
                        >
                          {t('auth.verifyOtp')}
                        </Button>
                      </FormControl>
                    )}

                    <FormControl isRequired>
                      <FormLabel>{t('auth.password')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder={t('auth.passwordPlaceholder')}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                            icon={showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                            variant="ghost"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('auth.confirmPasswordPlaceholder')}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>{t('auth.preferredLanguage')}</FormLabel>
                      <Select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                      >
                        {Object.entries(supportedLanguages).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>{t('auth.role')}</FormLabel>
                      <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="patient">{t('auth.roles.patient')}</option>
                        <option value="doctor">{t('auth.roles.doctor')}</option>
                        <option value="hospital">{t('auth.roles.hospital')}</option>
                      </Select>
                    </FormControl>

                    {registerError && (
                      <Text color="red.500" textAlign="center">
                        {registerError}
                      </Text>
                    )}

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      isLoading={registerLoading || otpLoading}
                      loadingText={
                        otpSent
                          ? otpVerified
                            ? t('auth.registering')
                            : t('auth.verifyingOtp')
                          : t('auth.sendingOtp')
                      }
                      width="100%"
                    >
                      {otpSent
                        ? otpVerified
                          ? t('auth.register')
                          : t('auth.verifyOtp')
                        : t('auth.sendOtp')}
                    </Button>
                  </Stack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Login;