import React, { Suspense } from 'react';
import { Box, Skeleton, Grid } from '@mui/material';
import LoansView from './components/LoansView';

export const dynamic = 'force-dynamic';

const FARMER_ID = 'F001';

async function LoansContent() {
  const [loansRes, collectionsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'}/api/loans?farmerId=${FARMER_ID}`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'}/api/collections?farmerId=${FARMER_ID}`, { cache: 'no-store' }),
  ]);

  const loans = loansRes.ok ? await loansRes.json() : [];
  const collections = collectionsRes.ok ? await collectionsRes.json() : [];

  return <LoansView loans={loans} collections={collections} farmerId={FARMER_ID} />;
}

export default function LoansPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Suspense fallback={<LoansSkeleton />}>
        <LoansContent />
      </Suspense>
    </Box>
  );
}

function LoansSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="30%" height={30} sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} /></Grid>
      </Grid>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4, mt: 3 }} />
    </Box>
  );
}
