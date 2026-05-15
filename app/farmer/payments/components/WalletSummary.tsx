'use client';
import React from 'react';
import { Box, Typography, Paper, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { ProduceCollection } from '@/app/lib/types';

interface WalletSummaryProps {
  collections: ProduceCollection[];
}

const MotionPaper = motion(Paper);

export default function WalletSummary({ collections }: WalletSummaryProps) {
  const totalEarnings = collections
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const awaitingPayment = collections
    .filter(c => c.status === 'PENDING' || (c.status as any) === 'PARTIAL')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const pendingCount = collections.filter(c => c.status === 'PENDING' || (c.status as any) === 'PARTIAL').length;

  const lastPayment = collections
    .filter(c => c.status === 'PAID')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            p: 3, 
            borderRadius: 4, 
            height: '100%', 
            position: 'relative', 
            overflow: 'hidden', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 100, color: '#00FF9D' }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Total Earnings
          </Typography>
          <Typography variant="h3" sx={{ color: '#00FF9D', fontWeight: 800, mt: 1 }}>
            KES {totalEarnings.toLocaleString()}
          </Typography>
          {lastPayment && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Last Payout: {new Date(lastPayment.timestamp).toLocaleDateString()} (KES {lastPayment.totalAmount.toLocaleString()})
            </Typography>
          )}
        </MotionPaper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{ 
            p: 3, 
            borderRadius: 4, 
            height: '100%', 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Awaiting Payment
          </Typography>
          <Typography variant="h3" sx={{ color: '#ED6C02', fontWeight: 800, mt: 1 }}>
            KES {awaitingPayment.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <HourglassEmptyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {pendingCount} pending collections
            </Typography>
          </Stack>
        </MotionPaper>
      </Grid>
    </Grid>
  );
}
