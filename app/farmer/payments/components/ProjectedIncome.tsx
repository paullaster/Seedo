'use client';
import React from 'react';
import { Box, Typography, Paper, Button, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { HarvestNotice, MarketRate } from '@/app/lib/types';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ProjectedIncomeProps {
  harvestNotices: HarvestNotice[];
  marketRates: MarketRate[];
}

const MotionPaper = motion(Paper);

export default function ProjectedIncome({ harvestNotices, marketRates }: ProjectedIncomeProps) {
  // Calculate Projected Income
  const projectedIncome = harvestNotices
    .filter(h => h.status === 'OPEN')
    .reduce((sum, h) => {
      const rate = marketRates.find(r => r.produceType === h.produceType)?.pricePerKg || 0;
      return sum + (h.estimatedWeightKg * rate);
    }, 0);

  return (
    <MotionPaper
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        height: '100%', 
        bgcolor: 'rgba(0, 229, 255, 0.05)', 
        border: '1px solid rgba(0, 229, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="info.main" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
            Potential Payout
          </Typography>
          <Tooltip title="Estimated value of your open harvest notices based on current market rates.">
            <InfoIcon fontSize="small" color="info" sx={{ opacity: 0.7 }} />
          </Tooltip>
        </Box>
        
        <Typography variant="h3" sx={{ color: '#00E5FF', fontWeight: 800, mt: 1 }}>
          KES {projectedIncome.toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Based on {harvestNotices.filter(h => h.status === 'OPEN').length} active harvest notices
        </Typography>
      </Box>

      <Button 
        variant="text" 
        color="info" 
        endIcon={<ArrowForwardIcon />}
        sx={{ mt: 3, justifyContent: 'flex-start', px: 0, fontWeight: 700 }}
      >
        Complete Harvest
      </Button>
    </MotionPaper>
  );
}
