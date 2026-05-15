import React, { Suspense } from 'react';
import { Box, Skeleton, Grid } from '@mui/material';
import { apiService } from '@/app/lib/api-service';
import PaymentsDashboard from './components/PaymentsDashboard';

// Force dynamic rendering since we are fetching data that might change
export const dynamic = 'force-dynamic';

async function PaymentsContent() {
  const farmerId = 'F001'; // Hardcoded for prototype

  // Fetch all data in parallel
  const [collections, marketRates, harvestNotices] = await Promise.all([
    apiService.getFarmerCollections(farmerId),
    apiService.getMarketRates(),
    apiService.getHarvestNotices(farmerId)
  ]);

  return (
    <PaymentsDashboard 
      collections={collections} 
      marketRates={marketRates} 
      harvestNotices={harvestNotices} 
    />
  );
}

export default function PaymentsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Suspense fallback={<PaymentsSkeleton />}>
        <PaymentsContent />
      </Suspense>
    </Box>
  );
}

function PaymentsSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="30%" height={30} sx={{ mb: 4 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3}>
             <Grid size={{ xs: 12, md: 6 }}>
               <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} />
             </Grid>
             <Grid size={{ xs: 12, md: 6 }}>
               <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} />
             </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
        </Grid>
      </Grid>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
    </Box>
  );
}
