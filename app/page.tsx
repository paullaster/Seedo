'use client';
import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Container, Grid2 as Grid, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();

  const modules = [
    {
      title: 'Farmer',
      description: 'Manage produce & account',
      icon: <AgricultureIcon fontSize="large" />,
      color: theme.palette.primary.main,
      path: '/farmer',
    },
    {
      title: 'Agent',
      description: 'Collection & Workflow',
      icon: <LocalShippingIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      path: '/agent',
    },
    {
      title: 'Admin',
      description: 'Management & Analytics',
      icon: <AdminPanelSettingsIcon fontSize="large" />,
      color: theme.palette.info.main,
      path: '/admin',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="700" color="primary" gutterBottom>
          AgriCollect
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Select your role to continue
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {modules.map((module) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.title}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardActionArea 
                onClick={() => router.push(module.path)} 
                sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                <Box sx={{ color: module.color, mb: 2 }}>
                  {module.icon}
                </Box>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
                    {module.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}