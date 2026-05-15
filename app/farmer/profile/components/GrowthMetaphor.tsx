'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Grass, Spa, LocalFlorist, Nature } from '@mui/icons-material';

interface GrowthMetaphorProps {
  percentage: number;
}

const GrowthMetaphor: React.FC<GrowthMetaphorProps> = ({ percentage }) => {
  const getStageInfo = (pct: number) => {
    if (pct <= 25) {
      return {
        icon: <Spa sx={{ fontSize: 60, color: '#8d6e63' }} />,
        message: 'Planting your digital roots...',
        description: 'Add your basic info to get started.'
      };
    } else if (pct <= 50) {
      return {
        icon: <Grass sx={{ fontSize: 80, color: '#4caf50' }} />,
        message: 'Your profile is sprouting!',
        description: 'Verify your identity to grow further.'
      };
    } else if (pct <= 75) {
      return {
        icon: <LocalFlorist sx={{ fontSize: 100, color: '#2e7d32' }} />,
        message: 'Your farm identity is blossoming!',
        description: 'Almost there! Add your location and crops.'
      };
    } else {
      return {
        icon: <Nature sx={{ fontSize: 120, color: '#1b5e20' }} />,
        message: 'Your digital farm is thriving!',
        description: 'Full identity verified and trusted.'
      };
    }
  };

  const { icon, message, description } = getStageInfo(percentage);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f1f8e9 0%, #ffffff 100%)',
        borderRadius: 4,
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
      }}
    >
      <Box sx={{ position: 'relative', height: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', mb: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={percentage <= 25 ? 'seed' : percentage <= 50 ? 'sprout' : percentage <= 75 ? 'flower' : 'tree'}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {icon}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
        {message}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      <Box sx={{ mt: 3, width: '100%', maxWidth: 300, bgcolor: '#e0e0e0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: '100%',
            backgroundColor: '#4caf50',
            borderRadius: 4
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ mt: 1, fontWeight: 'medium' }}>
        {percentage}% Complete
      </Typography>
    </Paper>
  );
};

export default GrowthMetaphor;
