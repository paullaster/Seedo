import React from 'react';
import { Typography, Container, Box } from '@mui/material';

export default function AgentDashboard() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Agent Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome, Agent. Start your collection workflow here.
        </Typography>
      </Box>
    </Container>
  );
}
