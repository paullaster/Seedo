'use client';

import React from 'react';
import { Box, Grid, Typography, Card, CardContent, alpha, useTheme } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Group,
  AccountBalanceWallet,
  Inventory,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Tonnage (Maize)', value: '142.5 Tons', trend: '+12%', icon: <Inventory />, color: '#2e7d32' },
  { label: 'Active Loans', value: 'KES 1.2M', trend: '+5%', icon: <AccountBalanceWallet />, color: '#1976d2' },
  { label: 'Total Farmers', value: '1,240', trend: '+20%', icon: <Group />, color: '#ef6c00' },
  { label: 'System Wastage', value: '2.4%', trend: '-1.5%', icon: <Warning />, color: '#c62828' },
];

const AdminStats = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {stats.map((stat, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: stat.trend.startsWith('+') ? '#e8f5e9' : '#ffebee',
                      color: stat.trend.startsWith('+') ? '#2e7d32' : '#c62828',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {stat.trend}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="900" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminStats;
