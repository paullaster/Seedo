'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import UserManagement from '../components/UserManagement';

export default function UsersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Hub Network
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Staff management and "Invite-Verify" protocol control.
        </Typography>
      </Box>

      <UserManagement />
    </Container>
  );
}