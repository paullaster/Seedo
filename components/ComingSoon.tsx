'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        height: '60vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        opacity: 0.7
      }}
    >
      <ConstructionIcon sx={{ fontSize: 80, mb: 2, color: 'text.secondary' }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        This module is currently under development. <br />
        Check back soon for updates.
      </Typography>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
      >
        Go Back
      </Button>
    </Box>
  );
}
