import React from 'react';
import { Typography, Container, Box } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, Admin. Manage the system and view analytics here.
        </Typography>
      </Box>
    </Container>
  );
}
