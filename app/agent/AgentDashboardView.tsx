'use client';
import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Stack, Chip, useTheme, Paper, Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  QrCodeScanner, LocalShipping, AttachMoney, Star, ArrowForward, VerifiedUser, Inventory, Timeline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { ProduceCollection, Agent } from '@/app/lib/types';

const MotionCard = motion(Card);

import { Alert } from '@mui/material';

export default function AgentDashboardView({
  agent,
  profile,
  collections,
  fetchError,
}: {
  agent: Agent;
  profile: { totalCollections: number; rating: number; commissionEarned: number; tier: number };
  collections: ProduceCollection[];
  fetchError?: string | null;
}) {
  const theme = useTheme();
  const router = useRouter();

  const stats = [
    { label: 'Total Collections', value: profile.totalCollections.toLocaleString(), icon: <LocalShipping />, color: theme.palette.primary.main },
    { label: 'Pending Payout', value: `KES ${(collections.filter(c => c.status === 'VERIFIED').length * 500).toLocaleString()}`, icon: <AttachMoney />, color: theme.palette.warning.main },
    { label: 'Agent Rating', value: `${profile.rating}/5.0`, icon: <Star />, color: theme.palette.secondary.main },
  ];

  return (
    <Box>
      {fetchError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
          Some data could not be loaded: {fetchError}. Please try refreshing the page.
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" gutterBottom>
          Agent Intake & Logistics Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {agent.name}. Your hub status: <strong>Operational</strong>
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
            <MotionCard whileHover={{ y: -5 }} sx={{ borderRadius: 4, border: '1px solid #eee', bgcolor: 'white' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{ p: 4, height: '100%', borderRadius: 5, bgcolor: 'primary.main', color: 'white', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => router.push('/agent/collection')}
              >
                <QrCodeScanner sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>Produce Intake</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                  Start a new physical collection from a farmer. Scan QR or search by ID.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}>
                  Start Intake
                </Button>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{ p: 4, height: '100%', borderRadius: 5, bgcolor: '#1a3c30', color: 'white', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => router.push('/agent/verification')}
              >
                <VerifiedUser sx={{ fontSize: 48, mb: 2, color: theme.palette.secondary.main }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>Audit & Sign</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                  Verify store batches and perform digital handshakes with Collection Agents.
                </Typography>
                <Button variant="contained" color="secondary">Open Auditor</Button>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline color="primary" /> Recent Hub Activity
            </Typography>
            <Stack spacing={2}>
              {collections.slice(0, 4).map((item) => (
                <Paper key={item.id} sx={{ p: 2, borderRadius: 3, border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f5f5f5' }}>
                      <Inventory sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{item.produceType} &bull; {item.weightKg}kg</Typography>
                      <Typography variant="caption" color="text.secondary">{item.id} &bull; {new Date(item.timestamp).toLocaleTimeString()}</Typography>
                    </Box>
                  </Stack>
                  <Chip label={item.status} size="small" variant="outlined" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                </Paper>
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #eee', height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Hub Health</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>STORE INVENTORY</Typography>
                <Typography variant="body1" fontWeight="medium">{collections.filter(c => c.status === 'PENDING').length} Batches Awaiting Audit</Typography>
                <Box sx={{ mt: 1, width: '100%', height: 6, bgcolor: '#eee', borderRadius: 3 }}>
                  <Box sx={{ width: '65%', height: '100%', bgcolor: 'warning.main', borderRadius: 3 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>COMMISSION TARGET</Typography>
                <Typography variant="body1" fontWeight="medium">KES {profile.commissionEarned.toLocaleString()} / 20,000</Typography>
                <Box sx={{ mt: 1, width: '100%', height: 6, bgcolor: '#eee', borderRadius: 3 }}>
                  <Box sx={{ width: `${Math.min(100, (profile.commissionEarned / 20000) * 100)}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 3 }} />
                </Box>
              </Box>
              <Divider />
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary">Pro-Tip:</Typography>
                <Typography variant="caption" color="text.secondary">
                  Always capture a clear photo of the scale. Verified photos speed up your commission approval by 40%.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
