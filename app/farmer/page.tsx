import React from 'react';
import { Typography, Container, Box } from '@mui/material';

export default function FarmerDashboard() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Farmer Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, Farmer. Here you can manage your account and produce.
        </Typography>
      </Box>
    </Container>
  );
}
