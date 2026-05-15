'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  Stack,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  History,
  Warning,
  HourglassEmpty,
  LocalShipping,
} from '@mui/icons-material';
import CollectionLedger from '../collection/components/CollectionLedger';
import type { ProduceCollection } from '@/app/lib/types';

export default function InventoryView({
  initialCollections,
}: {
  initialCollections: ProduceCollection[];
}) {
  const [tab, setTab] = useState(0);

  const inStore = initialCollections.filter(c => c.status === 'PENDING' || c.status === 'DISPUTED');
  const processed = initialCollections.filter(c => c.status !== 'PENDING' && c.status !== 'DISPUTED');

  const agingProduce = inStore.filter(c =>
    (Date.now() - new Date(c.timestamp).getTime() > 48 * 60 * 60 * 1000)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Store Inventory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Living ledger of physical assets currently held or processed in your assigned hub.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#fff3e0', color: '#ef6c00' }}>
              <HourglassEmpty />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">{inStore.length}</Typography>
              <Typography variant="body2" color="text.secondary">Items Awaiting Pickup</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#e3f2fd', color: '#1976d2' }}>
              <LocalShipping />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">{processed.length}</Typography>
              <Typography variant="body2" color="text.secondary">Recently Dispatched</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {agingProduce.length > 0 && (
        <Alert
          severity="error"
          icon={<Warning />}
          sx={{ mb: 4, borderRadius: 3, '& .MuiAlert-message': { width: '100%' } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight="bold">
              AGING ALERT: {agingProduce.length} batches have been in store for over 48 hours.
            </Typography>
            <Typography variant="caption" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Notify Collection Agent
            </Typography>
          </Box>
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="inventory tabs">
          <Tab icon={<InventoryIcon />} iconPosition="start" label="In-Store (Live)" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<History />} iconPosition="start" label="Processing History" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
        {tab === 0 ? (
          <CollectionLedger
            collections={inStore}
            agentType="STORE"
            onVerifyBatch={() => {}}
            onDispute={() => {}}
          />
        ) : (
          <CollectionLedger
            collections={processed}
            agentType="STORE"
            onVerifyBatch={() => {}}
            onDispute={() => {}}
          />
        )}
      </Paper>
    </Container>
  );
}
