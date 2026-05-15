'use client';
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ProduceCollection, MarketRate, HarvestNotice } from '@/app/lib/types';
import WalletSummary from './WalletSummary';
import ProjectedIncome from './ProjectedIncome';
import PriceTrends from './PriceTrends';
import PaymentPreparedness from './PaymentPreparedness';
import TransactionList from './TransactionList';
import StatementGenerator from './StatementGenerator';
import { motion } from 'framer-motion';

interface PaymentsDashboardProps {
  collections: ProduceCollection[];
  marketRates: MarketRate[];
  harvestNotices: HarvestNotice[];
}

export default function PaymentsDashboard({ collections, marketRates, harvestNotices }: PaymentsDashboardProps) {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #00FF9D 30%, #00E5FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Financial Hub
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Transparency and insights to power your farm&apos;s growth.
          </Typography>
        </motion.div>
      </Box>

      {/* Row 1: Summaries */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <WalletSummary collections={collections} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProjectedIncome harvestNotices={harvestNotices} marketRates={marketRates} />
        </Grid>
      </Grid>

      {/* Row 2: Trends & Readiness */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PriceTrends marketRates={marketRates} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <PaymentPreparedness />
        </Grid>
      </Grid>

      {/* Row 3: Transactions */}
      <TransactionList collections={collections} />

      {/* Row 4: Statements */}
      <StatementGenerator />
    </Box>
  );
}
