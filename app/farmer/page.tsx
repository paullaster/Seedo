'use client';
import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Chip, Button, IconButton, Stack, useTheme } from '@mui/material';
import { MOCK_WEATHER, MOCK_MARKET_RATES, MOCK_COLLECTIONS } from '@/app/lib/mock-data';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export default function FarmerDashboard() {
  const theme = useTheme();

  return (
    <Box>
      {/* 1. Weather & Welcome Section */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" gutterBottom>
              Welcome back, Elias!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here is your farm's performance overview for today.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MotionCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
              color: '#000'
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Weather Alert</Typography>
                <Typography variant="h3" fontWeight="900">{MOCK_WEATHER.temp}°C</Typography>
                <Typography variant="body2" fontWeight="500">{MOCK_WEATHER.forecast}</Typography>
              </Box>
              <WbSunnyIcon sx={{ fontSize: 60, opacity: 0.8 }} />
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* 2. Market Rates Ticker (Horizontal Scroll) */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <TrendingUpIcon color="primary" /> Live Market Rates
        </Typography>
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
          {MOCK_MARKET_RATES.map((rate) => (
            <MotionCard 
              key={rate.id}
              whileHover={{ y: -5 }}
              sx={{ minWidth: 200, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{rate.produceType}</Typography>
                <Stack direction="row" alignItems="flex-end" spacing={1}>
                  <Typography variant="h5" fontWeight="bold">KES {rate.pricePerKg}</Typography>
                  <Typography variant="caption" color="text.secondary">/kg</Typography>
                </Stack>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {rate.trend === 'UP' && <TrendingUpIcon fontSize="small" color="primary" />}
                  {rate.trend === 'DOWN' && <TrendingDownIcon fontSize="small" color="error" />}
                  {rate.trend === 'STABLE' && <TrendingFlatIcon fontSize="small" color="info" />}
                  <Typography variant="caption" color={rate.trend === 'UP' ? 'primary' : rate.trend === 'DOWN' ? 'error' : 'info.main'}>
                    {rate.trend} today
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Stack>
      </Box>

      {/* 3. Recent Collections List */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Recent Collections</Typography>
            <Button variant="outlined" size="small">View All</Button>
          </Box>
          
          <Stack spacing={2}>
            {MOCK_COLLECTIONS.map((collection) => (
              <MotionCard 
                key={collection.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                sx={{ bgcolor: 'background.paper' }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '16px !important' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${theme.palette.primary.main}15`, color: theme.palette.primary.main }}>
                      <LocalShippingIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{collection.produceType} ({collection.grade})</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(collection.timestamp).toLocaleDateString()} • {collection.weightKg}kg
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      KES {collection.totalAmount.toLocaleString()}
                    </Typography>
                    <Chip 
                      label={collection.status} 
                      size="small" 
                      color={collection.status === 'PAID' ? 'success' : collection.status === 'PENDING' ? 'warning' : 'info'}
                      variant="outlined"
                      sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                </CardContent>
              </MotionCard>
            ))}
          </Stack>
        </Grid>

        {/* 4. Quick Actions Side Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MotionCard sx={{ height: '100%', bgcolor: 'background.paper', border: `1px solid ${theme.palette.primary.main}30` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2} mt={2}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ py: 2 }}
                >
                  New Harvest Notice
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large"
                >
                  View Statements
                </Button>
                 <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large"
                >
                  My QR Code
                </Button>
              </Stack>

              <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                 <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                   FARMER STATUS
                 </Typography>
                 <Typography variant="body2" color="primary.main">
                   ● Active & Verified
                 </Typography>
                 <Typography variant="body2" color="text.secondary" mt={0.5}>
                   Region: Kiambu Zone A
                 </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}