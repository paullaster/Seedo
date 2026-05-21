import { Suspense } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getDeliveryNotes } from './actions';
import DeliveryNotesView from './DeliveryNotesView';

export default function DeliveryNotesPage() {
  const dataPromise = getDeliveryNotes()
    .then(data => ({ data, error: null as string | null }))
    .catch(err => ({ data: null as any, error: err instanceof Error ? err.message : 'Failed to load delivery notes' }));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} href="/admin" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Dashboard
        </Button>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Delivery Notes
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Create and manage warehouse delivery notes with batch generation.
        </Typography>
      </Box>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <DeliveryNotesView dataPromise={dataPromise} />
      </Suspense>
    </Container>
  );
}
