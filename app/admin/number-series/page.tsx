import { Suspense } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getNumberSeriesConfigs, getNumberableEntities } from './actions';
import NumberSeriesView from './NumberSeriesView';

export default function NumberSeriesPage() {
  const configsPromise = getNumberSeriesConfigs()
    .then(data => ({ data, error: null as string | null }))
    .catch(err => ({ data: null as any, error: err instanceof Error ? err.message : 'Failed to load configs' }));

  const entitiesPromise = getNumberableEntities()
    .then(data => ({ data, error: null as string | null }))
    .catch(err => ({ data: null as any, error: err instanceof Error ? err.message : 'Failed to load entities' }));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} href="/admin" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Dashboard
        </Button>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Number Series
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Configure auto-numbering for pickup requests, delivery notes, batches, and other entities.
        </Typography>
      </Box>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <NumberSeriesView configsPromise={configsPromise} entitiesPromise={entitiesPromise} />
      </Suspense>
    </Container>
  );
}
