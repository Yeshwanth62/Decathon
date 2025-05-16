import React from 'react';
import {
  Box,
  Heading,
  Text,
  Select,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Create motion components
const MotionBox = motion(Box);

const HealthDataChart = ({ 
  type = 'line', 
  data, 
  title, 
  description, 
  timeRange = '7d',
  onTimeRangeChange,
  height = 300,
}) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  // Default options for all chart types
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, sans-serif',
          },
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: useColorModeValue('white', 'gray.800'),
        titleColor: useColorModeValue('gray.800', 'white'),
        bodyColor: useColorModeValue('gray.800', 'white'),
        borderColor: borderColor,
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          // Custom tooltip callbacks can be added here
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: borderColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: borderColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };
  
  // Time range options
  const timeRangeOptions = [
    { value: '7d', label: t('health.timeRange.week') },
    { value: '30d', label: t('health.timeRange.month') },
    { value: '90d', label: t('health.timeRange.quarter') },
    { value: '365d', label: t('health.timeRange.year') },
  ];
  
  // Render the appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} height={height} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} height={height} />;
      case 'doughnut':
        return <Doughnut data={data} options={{
          ...defaultOptions,
          cutout: '70%',
        }} height={height} />;
      default:
        return <Line data={data} options={defaultOptions} height={height} />;
    }
  };
  
  return (
    <MotionBox
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
      boxShadow="sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: 'md' }}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading as="h3" size="md" mb={1}>
            {title}
          </Heading>
          {description && (
            <Text fontSize="sm" color={textColor}>
              {description}
            </Text>
          )}
        </Box>
        
        {onTimeRangeChange && (
          <Select
            size="sm"
            width="auto"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </Flex>
      
      <Box height={`${height}px`} position="relative">
        {renderChart()}
      </Box>
    </MotionBox>
  );
};

export default HealthDataChart;
