'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoanManagement from '../components/LoanManagement';

export default function LoansPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Loan Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          End-to-end oversight of the closed-loop input loan economy.
        </Typography>
      </Box>

      <LoanManagement />
    </Container>
  );
}
