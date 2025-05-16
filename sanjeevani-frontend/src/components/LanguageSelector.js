import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { supportedLanguages } from '../i18n';
import { getUserLanguage, getLanguageName } from '../utils/helper';
import { updateLanguage } from '../utils/auth';

// Create a motion box component
const MotionBox = motion(Box);

const LanguageSelector = (props) => {
  const { i18n, t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentLanguage, setCurrentLanguage] = useState(getUserLanguage());
  const [isChanging, setIsChanging] = useState(false);

  // Change language
  const changeLanguage = async (langCode) => {
    if (langCode === currentLanguage) return;

    setIsChanging(true);

    try {
      // Change language in i18next
      await i18n.changeLanguage(langCode);

      // Update language in backend if user is logged in
      if (localStorage.getItem('token')) {
        await updateLanguage(langCode);
      }

      setCurrentLanguage(langCode);
    } catch (error) {
      console.error('Language change error:', error);
    } finally {
      setIsChanging(false);
      onClose();
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<FaGlobe />}
          variant="ghost"
          size="md"
          isLoading={isChanging}
          loadingText={t('language.changing')}
        >
          <Text display={{ base: 'none', md: 'block' }}>
            {getLanguageName(currentLanguage)}
          </Text>
        </MenuButton>
        <MenuList width="200px">
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <MenuItem
              key={code}
              onClick={() => changeLanguage(code)}
              closeOnSelect={true}
              icon={code === currentLanguage ? <CheckIcon color="green.500" /> : null}
            >
              <Flex justify="space-between" align="center" width="100%">
                <Text>{name}</Text>
                {code === currentLanguage && (
                  <Text fontSize="xs" color="gray.500">
                    {t('language.current')}
                  </Text>
                )}
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </MotionBox>
  );
};

export default LanguageSelector;
