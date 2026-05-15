'use client';
import React from 'react';
import { Box, Typography, Card, CardActionArea, Container, Grid, useTheme, Chip, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

export default function Home() {
  const router = useRouter();
  const theme = useTheme();

  const modules = [
    {
      title: 'DIRECTORY',
      subtitle: 'Public Discovery',
      description: 'Locate verified collection stores and mobile agents near you instantly.',
      icon: <MapIcon sx={{ fontSize: 60 }} />,
      color: theme.palette.info.main,
      path: '/discovery',
      badge: 'PUBLIC'
    },
    {
      title: 'FARMER',
      subtitle: 'Production & Accounts',
      description: 'Manage harvest data, track growth cycles, and view financial statements.',
      icon: <AgricultureIcon sx={{ fontSize: 60 }} />,
      color: theme.palette.primary.main,
      path: '/farmer',
      badge: 'PRODUCE'
    },
    {
      title: 'AGENT',
      subtitle: 'Logistics & Workflow',
      description: 'Coordinate collections, verify quality, and manage transport logistics.',
      icon: <LocalShippingIcon sx={{ fontSize: 60 }} />,
      color: theme.palette.secondary.main,
      path: '/agent',
      badge: 'LOGISTICS'
    },
    {
      title: 'ADMIN',
      subtitle: 'Control & Analytics',
      description: 'System-wide oversight, user management, and advanced reporting metrics.',
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 60 }} />,
      color: '#FF4081', // Pink/Red neon for admin
      path: '/admin',
      badge: 'SYSTEM'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 }}>
      
      <Box component={motion.div} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} sx={{ textAlign: 'center', mb: 10 }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={2}>
           <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: `0 0 10px ${theme.palette.primary.main}` }} />
           <Typography variant="overline" color="primary" letterSpacing={3}>SYSTEM ONLINE</Typography>
        </Stack>
        
        <Typography variant="h1" sx={{ 
          background: `linear-gradient(180deg, #fff 0%, ${theme.palette.primary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 30px ${theme.palette.primary.main}40)`,
          fontSize: { xs: '3rem', md: '5rem' }
        }}>
          AgriCollect
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2, fontWeight: 300 }}>
          Next-Generation Agricultural Supply Chain Management
        </Typography>
      </Box>

      <MotionGrid container spacing={4} variants={containerVariants} initial="hidden" animate="visible">
        {modules.map((module) => (
          <MotionGrid size={{ xs: 12, sm: 6, md: 3 }} key={module.title} variants={itemVariants}>
            <MotionCard
              whileHover={{ scale: 1.05, translateY: -10 }}
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${module.color}, transparent)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                },
                '&:hover::before': {
                  opacity: 1
                }
              }}
            >
              <CardActionArea
                onClick={() => router.push(module.path)}
                sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" width="100%" mb={3}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: '12px', 
                      bgcolor: `${module.color}15`, 
                      color: module.color,
                      boxShadow: `0 0 20px ${module.color}20`
                    }}>
                      {module.icon}
                    </Box>
                    <Chip label={module.badge} size="small" sx={{ borderColor: module.color, color: module.color, fontWeight: 700, height: 20, fontSize: '0.65rem' }} variant="outlined" />
                  </Stack>
                  
                  <Typography variant="h5" gutterBottom fontWeight="800" letterSpacing={1}>
                    {module.title}
                  </Typography>
                  <Typography variant="caption" color="primary.light" gutterBottom sx={{ mb: 1, display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                     {module.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
                    {module.description}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: module.color, gap: 1 }}>
                  <Typography variant="button" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Open</Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Box>
              </CardActionArea>
            </MotionCard>
          </MotionGrid>
        ))}
      </MotionGrid>
    </Container>
  );
}