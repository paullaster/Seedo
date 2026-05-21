import { Suspense } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getPickupRequests } from './actions';
import PickupRequestsView from './PickupRequestsView';

export default function PickupRequestsPage() {
  const dataPromise = getPickupRequests()
    .then(data => ({ data, error: null as string | null }))
    .catch(err => ({ data: null as any, error: err instanceof Error ? err.message : 'Failed to load pickup requests' }));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} href="/admin" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Dashboard
        </Button>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Pickup Requests
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Manage collection-to-warehouse transfer requests.
        </Typography>
      </Box>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <PickupRequestsView dataPromise={dataPromise} />
      </Suspense>
    </Container>
  );
}
