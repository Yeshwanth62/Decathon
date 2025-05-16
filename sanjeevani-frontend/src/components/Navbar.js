import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Components
import NotificationSystem from './NotificationSystem';

const Navbar = ({ user, onLogout, toggleVoiceAssistant }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const location = useLocation();

  // Navigation links
  const Links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.appointments'), path: '/appointments/book' },
  ];

  // Add dashboard link if user is logged in
  if (user) {
    Links.push({ name: t('nav.dashboard'), path: '/dashboard' });
  }

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Pre-compute color values
  const bgColor = useColorModeValue('white', 'gray.900');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      px={4}
      boxShadow="sm"
      position="fixed"
      width="100%"
      zIndex="999"
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <RouterLink to="/">
              <Flex alignItems="center">
                <Image src="/assets/logo.png" alt="Sanjeevani Logo" height="40px" mr={2} />
                <Text fontSize="xl" fontWeight="bold" color="brand.500">
                  Sanjeevani
                </Text>
              </Flex>
            </RouterLink>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <Link
                key={link.name}
                as={RouterLink}
                to={link.path}
                px={2}
                py={1}
                rounded={'md'}
                fontWeight={isActive(link.path) ? 'bold' : 'normal'}
                color={isActive(link.path) ? 'brand.500' : 'gray.600'}
                _hover={{
                  textDecoration: 'none',
                  bg: hoverBg,
                }}
              >
                {link.name}
              </Link>
            ))}
          </HStack>
        </HStack>

        <Flex alignItems={'center'}>
          {/* Voice Assistant Button */}
          <IconButton
            aria-label={t('voice.assistant')}
            icon={<FaMicrophone />}
            colorScheme="brand"
            variant="ghost"
            mr={2}
            onClick={toggleVoiceAssistant}
          />

          {/* Notification System */}
          {user && (
            <Box mr={2}>
              <NotificationSystem user={user} />
            </Box>
          )}

          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Flex alignItems="center">
                  <Text mr={2} display={{ base: 'none', md: 'block' }}>
                    {user.name}
                  </Text>
                  <Box
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FaUser />
                  </Box>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard" icon={<FaUser />}>
                  {t('nav.dashboard')}
                </MenuItem>
                <MenuItem as={RouterLink} to="/profile" icon={<FaCog />}>
                  {t('nav.profile')}
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FaSignOutAlt />} onClick={onLogout}>
                  {t('nav.logout')}
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="brand"
              variant={isActive('/login') ? 'solid' : 'outline'}
            >
              {t('nav.login')}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile Navigation Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <Link
                key={link.name}
                as={RouterLink}
                to={link.path}
                px={2}
                py={1}
                rounded={'md'}
                fontWeight={isActive(link.path) ? 'bold' : 'normal'}
                color={isActive(link.path) ? 'brand.500' : 'gray.600'}
                _hover={{
                  textDecoration: 'none',
                  bg: hoverBg,
                }}
                onClick={onClose}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link
                as={RouterLink}
                to="/login"
                px={2}
                py={1}
                rounded={'md'}
                fontWeight={isActive('/login') ? 'bold' : 'normal'}
                color={isActive('/login') ? 'brand.500' : 'gray.600'}
                _hover={{
                  textDecoration: 'none',
                  bg: hoverBg,
                }}
                onClick={onClose}
              >
                {t('nav.login')}
              </Link>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;