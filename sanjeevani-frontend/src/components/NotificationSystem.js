import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Badge,
  Text,
  Stack,
  Flex,
  Avatar,
  useDisclosure,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const NotificationSystem = ({ user }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect to socket server
  useEffect(() => {
    if (!user) return;

    // In a real app, this would be your actual socket server URL
    const socketServer = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
    const newSocket = io(socketServer, {
      auth: {
        token: localStorage.getItem('token'),
      },
      autoConnect: false,
    });

    // For demo purposes, we'll simulate socket connection
    setSocket(newSocket);

    // Generate mock notifications
    const mockNotifications = generateMockNotifications();
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Listen for new notifications
  useEffect(() => {
    if (!socket) return;

    // In a real app, you would connect to the socket server
    // socket.connect();

    // In a real app, you would listen for notifications
    // socket.on('notification', handleNewNotification);

    // For demo purposes, we'll simulate receiving a new notification every 30 seconds
    const interval = setInterval(() => {
      const newNotification = {
        id: `notification-${Date.now()}`,
        title: 'New Appointment',
        message: 'Dr. Smith has confirmed your appointment for tomorrow at 10:00 AM.',
        timestamp: new Date(),
        read: false,
        type: ['appointment', 'reminder', 'message'][Math.floor(Math.random() * 3)],
      };

      handleNewNotification(newNotification);
    }, 30000);

    return () => {
      clearInterval(interval);
      // In a real app, you would remove the event listener
      // socket.off('notification', handleNewNotification);
    };
  }, [socket]);

  // Handle new notification
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  }, [toast]);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    setUnreadCount(0);
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);

      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }

      return newNotifications;
    });
  }, []);

  // Generate mock notifications
  const generateMockNotifications = () => {
    return [
      {
        id: 'notification-1',
        title: 'Appointment Reminder',
        message: 'You have an appointment with Dr. Johnson tomorrow at 2:00 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        type: 'appointment',
      },
      {
        id: 'notification-2',
        title: 'Medication Reminder',
        message: 'Time to take your medication. Don\'t forget!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        type: 'reminder',
      },
      {
        id: 'notification-3',
        title: 'New Message',
        message: 'Dr. Smith has sent you a message regarding your recent test results.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false,
        type: 'message',
      },
    ];
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '🗓️';
      case 'reminder':
        return '⏰';
      case 'message':
        return '✉️';
      default:
        return '🔔';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'blue';
      case 'reminder':
        return 'orange';
      case 'message':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Pre-compute color values
  const unreadBgColor = useColorModeValue('gray.50', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

  if (!user) return null;

  return (
    <>
      <Box position="relative">
        <IconButton
          aria-label="Notifications"
          icon={<FaBell />}
          variant="ghost"
          onClick={onOpen}
        />

        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-2px"
            right="-2px"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {t('notifications.title')}
            {unreadCount > 0 && (
              <Badge ml={2} colorScheme="red" borderRadius="full">
                {unreadCount} {t('notifications.unread')}
              </Badge>
            )}
          </DrawerHeader>

          <DrawerBody p={0}>
            {notifications.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="100%"
                p={4}
                textAlign="center"
              >
                <Box fontSize="4xl" mb={4}>🔔</Box>
                <Text>{t('notifications.empty')}</Text>
              </Flex>
            ) : (
              <Stack spacing={0} divider={<Box borderBottomWidth="1px" />}>
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <MotionFlex
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      p={4}
                      bg={notification.read ? 'transparent' : unreadBgColor}
                      borderLeftWidth="4px"
                      borderLeftColor={`${getNotificationColor(notification.type)}.500`}
                      _hover={{ bg: hoverBgColor }}
                    >
                      <Box fontSize="xl" mr={3}>
                        {getNotificationIcon(notification.type)}
                      </Box>
                      <Box flex="1">
                        <Flex justify="space-between" align="center" mb={1}>
                          <Text fontWeight="bold">{notification.title}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </Flex>
                        <Text fontSize="sm" mb={2}>{notification.message}</Text>
                        <Flex justify="flex-end">
                          {!notification.read && (
                            <IconButton
                              aria-label="Mark as read"
                              icon={<FaCheck />}
                              size="sm"
                              variant="ghost"
                              colorScheme="green"
                              mr={2}
                              onClick={() => markAsRead(notification.id)}
                            />
                          )}
                          <IconButton
                            aria-label="Delete notification"
                            icon={<FaTrash />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => deleteNotification(notification.id)}
                          />
                        </Flex>
                      </Box>
                    </MotionFlex>
                  ))}
                </AnimatePresence>
              </Stack>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              {t('common.close')}
            </Button>
            <Button
              colorScheme="brand"
              onClick={markAllAsRead}
              isDisabled={unreadCount === 0}
            >
              {t('notifications.markAllRead')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NotificationSystem;
