'use client';
import React from 'react';
import { Box, Grid, Typography, Card, CardContent, LinearProgress, Stack, useTheme, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarehouseIcon from '@mui/icons-material/Warehouse';

const MotionCard = motion(Card);

export default function AdminDashboard() {
  const theme = useTheme();

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          System Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time metrics on collections, disbursements, and system health.
        </Typography>
      </Box>

      {/* 1. Top Level Metrics */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'Total Collections (Today)', value: '12,500 kg', color: theme.palette.primary.main, trend: '+12%' },
          { label: 'Disbursed Amount', value: 'KES 1.2M', color: theme.palette.secondary.main, trend: '+5%' },
          { label: 'Active Agents', value: '24/30', color: theme.palette.info.main, trend: 'Stable' },
        ].map((metric) => (
          <Grid size={{ xs: 12, md: 4 }} key={metric.label}>
             <MotionCard sx={{ bgcolor: 'background.paper', height: '100%' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary" letterSpacing={1}>{metric.label}</Typography>
                  <Typography variant="h3" fontWeight="900" sx={{ my: 1 }}>{metric.value}</Typography>
                  <Chip 
                    label={metric.trend} 
                    size="small" 
                    sx={{ 
                      bgcolor: `${metric.color}20`, 
                      color: metric.color, 
                      fontWeight: 'bold', 
                      borderRadius: '6px' 
                    }} 
                  />
                </CardContent>
                <Box sx={{ height: 4, bgcolor: `${metric.color}20`, width: '100%' }}>
                  <Box sx={{ height: '100%', width: '70%', bgcolor: metric.color }} />
                </Box>
             </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* 2. Warehouse vs Wastage Analytics */}
        <Grid size={{ xs: 12, md: 8 }}>
          <MotionCard sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                 <Typography variant="h6" fontWeight="bold">Warehouse Status</Typography>
                 <WarehouseIcon color="primary" />
              </Box>
              
              <Stack spacing={4}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Maize (Grade A)</Typography>
                    <Typography variant="body2" fontWeight="bold">85% Full</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} color="primary" sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Wheat (Grade B)</Typography>
                    <Typography variant="body2" fontWeight="bold">45% Full</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={45} color="secondary" sx={{ height: 10, borderRadius: 5 }} />
                </Box>

                 <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Beans (Mixed)</Typography>
                    <Typography variant="body2" fontWeight="bold">20% Full</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={20} color="warning" sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </Stack>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* 3. Recent Alerts */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MotionCard sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>System Alerts</Typography>
              <Stack spacing={2} mt={2}>
                 <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${theme.palette.error.main}15`, border: `1px solid ${theme.palette.error.main}30` }}>
                    <Typography variant="caption" color="error.main" fontWeight="bold">HIGH WASTAGE DETECTED</Typography>
                    <Typography variant="body2">Agent A002 reported 15% wastage on latest batch.</Typography>
                 </Box>
                 <Box sx={{ p: 2, borderRadius: 2, bgcolor: `${theme.palette.info.main}15`, border: `1px solid ${theme.palette.info.main}30` }}>
                    <Typography variant="caption" color="info.main" fontWeight="bold">PRICE UPDATE</Typography>
                    <Typography variant="body2">Market rates for Maize updated to 45.50/kg.</Typography>
                 </Box>
              </Stack>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}