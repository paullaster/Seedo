import { Suspense } from 'react';
import { Box, Typography, Container } from '@mui/material';
import AdminStats, { AdminStatsSkeleton } from './components/AdminStats';
import MarketIntelligence, { MarketIntelligenceSkeleton } from './components/MarketIntelligence';
import WastageHeatmap, { WastageHeatmapSkeleton } from './components/WastageHeatmap';
import { getMarketRates } from './markets/actions';
import { getDashboardStats } from './stats/actions';
import { getWastageRecords } from './wastage/actions';

export default async function AdminDashboard() {
  const ratesPromise = getMarketRates();
  const statsPromise = getDashboardStats();
  const wastagePromise = getWastageRecords();

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Command Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Strategic overview and system-wide intelligence.
        </Typography>
      </Box>

      <Suspense fallback={<AdminStatsSkeleton />}>
        <AdminStats statsPromise={statsPromise} />
      </Suspense>

      <Box sx={{ mt: 6 }}>
        <Suspense fallback={<MarketIntelligenceSkeleton />}>
          <MarketIntelligence ratesPromise={ratesPromise} />
        </Suspense>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Suspense fallback={<WastageHeatmapSkeleton />}>
          <WastageHeatmap recordsPromise={wastagePromise} />
        </Suspense>
      </Box>
    </Container>
  );
}
