'use client';
import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Stack, Chip, useTheme, Avatar } from '@mui/material';
import { MOCK_COLLECTIONS, MOCK_AGENTS } from '@/app/lib/mock-data';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export default function AgentDashboard() {
  const theme = useTheme();
  const agent = MOCK_AGENTS[0]; // Simulate logged-in agent

  const stats = [
    { label: 'Total Collections', value: '1,450', icon: <LocalShippingIcon />, color: theme.palette.primary.main },
    { label: 'Pending Payouts', value: 'KES 85k', icon: <AttachMoneyIcon />, color: theme.palette.warning.main },
    { label: 'My Rating', value: '4.8/5.0', icon: <StarIcon />, color: theme.palette.secondary.main },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Agent Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage collections, payouts, and farmer verification.
        </Typography>
      </Box>

      {/* 1. Key Stats */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
            <MotionCard 
              whileHover={{ y: -5 }}
              sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* 2. Main Action: Start Collection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MotionCard 
            sx={{ 
              height: '100%', 
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.paper} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
              bgcolor: theme.palette.primary.main, opacity: 0.1, borderRadius: '50%' 
            }} />
            
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
              <QrCodeScannerIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                New Collection
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Scan Farmer ID or search manually to start a new produce collection entry.
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                endIcon={<ArrowForwardIcon />}
                sx={{ width: 'fit-content' }}
              >
                Start Process
              </Button>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* 3. Recent Activity Feed */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Today's Activity
          </Typography>
          <Stack spacing={2}>
            {MOCK_COLLECTIONS.slice(0, 3).map((item) => (
              <MotionCard key={item.id} sx={{ bgcolor: 'background.paper' }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                      {item.id}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {item.produceType} • {item.weightKg}kg
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={item.status} 
                    size="small" 
                    color={item.status === 'PAID' ? 'success' : 'warning'} 
                    variant="outlined"
                  />
                </CardContent>
              </MotionCard>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}