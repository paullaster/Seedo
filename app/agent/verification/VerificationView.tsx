'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  VerifiedUser,
  LocalShipping,
  Inventory,
  Warning,
} from '@mui/icons-material';
import CollectionLedger from '../collection/components/CollectionLedger';
import VerificationDrawer from '../collection/components/VerificationDrawer';
import type { ProduceCollection } from '@/app/lib/types';

export default function VerificationView({
  initialCollections,
}: {
  initialCollections: ProduceCollection[];
}) {
  const [collections, setCollections] = useState<ProduceCollection[]>(initialCollections);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleVerifyBatch = (ids: string[]) => {
    setSelectedIds(ids);
    setIsDrawerOpen(true);
  };

  const handleConfirmVerification = async (otp: string): Promise<boolean> => {
    try {
      const results = await Promise.allSettled(
        selectedIds.map(id =>
          fetch(`/api/collections/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'VERIFIED' }),
          })
        )
      );

      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok));

      if (failed.length > 0 && selectedIds.length === failed.length) {
        throw new Error('Batch verification failed');
      }

      setCollections(prev =>
        prev.map(c =>
          selectedIds.includes(c.id)
            ? { ...c, status: 'VERIFIED' as const, verifiedAt: new Date().toISOString() }
            : c
        )
      );

      setNotification({
        show: true,
        message: `Batch of ${selectedIds.length - failed.length} collections verified!${failed.length > 0 ? ` ${failed.length} failed.` : ''}`,
        type: failed.length > 0 ? 'warning' : 'success',
      });

      return true;
    } catch {
      setNotification({
        show: true,
        message: 'Verification failed. Please try again.',
        type: 'error',
      });
      return false;
    }
  };

  const handleDispute = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/collections/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISPUTED' }),
      });

      if (!res.ok) throw new Error('Failed to dispute collection');

      setCollections(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, status: 'DISPUTED' as const, disputeReason: reason }
            : c
        )
      );
      setNotification({
        show: true,
        message: 'Collection marked as disputed.',
        type: 'error',
      });
    } catch {
      setNotification({
        show: true,
        message: 'Failed to dispute collection.',
        type: 'error',
      });
    }
  };

  const stats = [
    { label: 'Awaiting Pickup', value: collections.filter(c => c.status === 'PENDING').length, icon: <Inventory />, color: '#ef6c00' },
    { label: 'Verified / In-Transit', value: collections.filter(c => c.status === 'VERIFIED' || c.status === 'IN_TRANSIT').length, icon: <LocalShipping />, color: '#1976d2' },
    { label: 'Completed Logistics', value: collections.filter(c => c.status === 'PAID' || c.status === 'PICKED_UP').length, icon: <VerifiedUser />, color: '#2e7d32' },
  ];

  const selectedCollections = collections.filter(c => selectedIds.includes(c.id));

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Audit & Verification
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verify store intakes, sign digital handshakes, and manage logistics.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, md: 4 }} key={stat.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {collections.some(c => c.status === 'PENDING' && (Date.now() - new Date(c.timestamp).getTime() > 48 * 60 * 60 * 1000)) && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 4, borderRadius: 3 }}>
          Some produce has been sitting in store for over 48 hours. Please prioritize these pickups.
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Store Inventory Ledger
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select batches to perform bulk verification and digital signing.
        </Typography>

        <CollectionLedger
          collections={collections}
          agentType="COLLECTION"
          onVerifyBatch={handleVerifyBatch}
          onDispute={handleDispute}
        />
      </Paper>

      <VerificationDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCollections={selectedCollections}
        onVerify={handleConfirmVerification}
      />

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.type} variant="filled" sx={{ borderRadius: 2 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
