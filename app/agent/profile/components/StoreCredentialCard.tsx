'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import {
  Verified,
  WorkspacePremium,
  QrCode2,
  LocationOn,
  MilitaryTech,
} from '@mui/icons-material';
import { AgentProfile } from '@/app/lib/types';

interface StoreCredentialCardProps {
  profile: AgentProfile;
}

const StoreCredentialCard: React.FC<StoreCredentialCardProps> = ({ profile }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 5,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
        mb: 4,
      }}
    >
      <Box sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <WorkspacePremium fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" letterSpacing={1}>
                AgriCollect
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                Certified Agent
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={`Tier ${profile.tier} Agent`}
            color="primary"
            icon={<MilitaryTech />}
            sx={{ fontWeight: 'bold', borderRadius: 2 }}
          />
        </Stack>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, alignItems: 'center' }}>
          <Avatar
            src={profile.avatarUrl}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {profile.name}
              <Verified color="primary" sx={{ ml: 1, verticalAlign: 'middle' }} />
            </Typography>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center" sx={{ mb: 1 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body1" color="text.secondary">
                {profile.region} • Store ID: {profile.storeId}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ bgcolor: 'rgba(0,0,0,0.05)', px: 1.5, py: 0.5, borderRadius: 10, fontWeight: 'medium' }}>
              Member since {new Date().getFullYear() - 1}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <QrCode2 sx={{ fontSize: 80, color: 'text.primary' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ color: 'text.secondary' }}>
              VALIDATE
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 4, py: 2, bgcolor: 'rgba(25, 118, 210, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          CREDENTIAL ID: {profile.id}-CERT-2025
        </Typography>
        <Typography variant="caption" color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }}>
          SHARE CERTIFICATE
        </Typography>
      </Box>
    </Paper>
  );
};

export default StoreCredentialCard;
