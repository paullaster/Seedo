'use client';

import React from 'react';
import { Box, Typography, Container, Stack, Divider } from '@mui/material';
import AdminStats from './components/AdminStats';
import WastageHeatmap from './components/WastageHeatmap';
import MarketIntelligence from './components/MarketIntelligence';

export default function AdminDashboard() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Command Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Strategic overview and system-wide intelligence.
        </Typography>
      </Box>

      <AdminStats />

      <Box sx={{ mt: 6 }}>
        <MarketIntelligence />
      </Box>

      <Box sx={{ mt: 6 }}>
        <WastageHeatmap />
      </Box>
    </Container>
  );
}
