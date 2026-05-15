'use client';
import React from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { MarketRate } from '@/app/lib/types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface PriceTrendsProps {
  marketRates: MarketRate[];
}

const MotionPaper = motion(Paper);

export default function PriceTrends({ marketRates }: PriceTrendsProps) {
  // Helper to generate a simple sparkline path
  // Since we don't have historical data in the MarketRate type (it just has trend), 
  // we will simulate a path based on the trend for the prototype.
  const getSparklinePath = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    if (trend === 'UP') return "M0,25 C20,25 20,20 40,22 C60,24 60,10 100,5";
    if (trend === 'DOWN') return "M0,5 C20,5 20,10 40,15 C60,20 60,25 100,25";
    return "M0,15 L100,15";
  };

  const getSparklineColor = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    if (trend === 'UP') return '#00FF9D'; // Success
    if (trend === 'DOWN') return '#FF3D00'; // Error
    return '#0288d1'; // Info
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', height: '100%' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Market Price Trends</Typography>
        <Typography variant="caption" color="text.secondary">Last 30 Days</Typography>
      </Box>
      <Stack spacing={3}>
        {marketRates.map(rate => (
          <Box key={rate.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{rate.produceType}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>KES {rate.pricePerKg}<Typography component="span" variant="caption" sx={{ ml: 0.5 }}>/kg</Typography></Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: rate.trend === 'UP' ? 'success.main' : rate.trend === 'DOWN' ? 'error.main' : 'info.main' }}>
                  {rate.trend === 'UP' && <TrendingUpIcon fontSize="small" />}
                  {rate.trend === 'DOWN' && <TrendingDownIcon fontSize="small" />}
                  {rate.trend === 'STABLE' && <TrendingFlatIcon fontSize="small" />}
                  <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 700 }}>
                    {rate.trend === 'UP' ? '+4.2%' : rate.trend === 'DOWN' ? '-2.1%' : 'Stable'}
                  </Typography>
                </Box>
                {/* Sparkline SVG */}
                <Box sx={{ width: 100, height: 30, mt: 1 }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <motion.path
                      d={getSparklinePath(rate.trend)}
                      fill="none"
                      stroke={getSparklineColor(rate.trend)}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </Box>
        ))}
      </Stack>
    </MotionPaper>
  );
}
