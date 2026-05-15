import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import FinancialOverview from '../components/FinancialOverview';

export default function FinancialsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Financial Control
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Forensic auditing, bulk payouts, and invoice validation.
        </Typography>
      </Box>

      <FinancialOverview />
    </Container>
  );
}
