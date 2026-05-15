'use client';
import React from 'react';
import { Box, Typography, Paper, Stack, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const MotionPaper = motion(Paper);

export default function PaymentPreparedness() {
  // Mock readiness data
  const readiness = 66;

  return (
    <MotionPaper
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Payment Readiness</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete these steps to ensure instant payouts.
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleOutlineIcon color="success" />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Bank Details Verified</Typography>
            <Typography variant="caption" color="text.secondary">KCB Account ****4432</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircleOutlineIcon color="success" />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>National ID Uploaded</Typography>
            <Typography variant="caption" color="text.secondary">Verified on 12 Oct 2025</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningAmberIcon color="warning" />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Tax Compliance (KRA)</Typography>
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700, cursor: 'pointer' }}>Action required</Typography>
          </Box>
        </Box>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
           <Typography variant="caption" sx={{ fontWeight: 600 }}>Overall Readiness</Typography>
           <Typography variant="caption" sx={{ fontWeight: 700 }}>{readiness}%</Typography>
        </Box>
        <LinearProgress 
            variant="determinate" 
            value={readiness} 
            sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(0,0,0,0.05)', 
                '& .MuiLinearProgress-bar': { bgcolor: Number(readiness) === 100 ? '#00FF9D' : '#FFAB00' } 
            }} 
        />
      </Box>
    </MotionPaper>
  );
}
