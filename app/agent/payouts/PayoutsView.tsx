'use client';
import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import {
  AttachMoney,
  AccountBalanceWallet,
  ReceiptLong,
  CheckCircle,
  RequestQuote,
  TrendingUp,
} from '@mui/icons-material';
import type { ProduceCollection } from '@/app/lib/types';

export default function PayoutsView({
  collections,
  commissionEarned,
  totalCollections,
  tier,
  agentId,
}: {
  collections: ProduceCollection[];
  commissionEarned: number;
  totalCollections: number;
  tier: number;
  agentId: string;
}) {
  const [payoutLoading, setPayoutLoading] = React.useState(false);
  const [payoutResult, setPayoutResult] = React.useState<{ ok: boolean; message: string } | null>(null);
  const pendingCollections = collections.filter(c => c.status === 'VERIFIED');
  const totalPendingCommission = pendingCollections.length * 500;

  const handleRequestPayout = async () => {
    setPayoutLoading(true);
    setPayoutResult(null);
    try {
      const ids = pendingCollections.map(c => c.id);
      const res = await fetch('/api/financials/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, agentId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
      }
      setPayoutResult({ ok: true, message: `Payout request submitted for ${ids.length} collection(s). Processing will complete by Friday.` });
    } catch (err) {
      setPayoutResult({ ok: false, message: err instanceof Error ? err.message : 'Failed to submit payout request' });
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Earnings & Payouts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your commissions and request payouts for verified collections.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <AccountBalanceWallet sx={{ position: 'absolute', right: -10, top: -10, fontSize: 120, opacity: 0.1 }} />
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Available for Payout</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
              KES {totalPendingCommission.toLocaleString()}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={totalPendingCommission === 0 || payoutLoading}
              onClick={handleRequestPayout}
              sx={{
                mt: 2,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: '#f5f5f5' },
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              {payoutLoading ? 'Submitting...' : 'Request Payout'}
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#e8f5e9', color: '#2e7d32' }}>
                <TrendingUp />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">Total Commission Earned</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="bold">
              KES {commissionEarned.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">Across {totalCollections} collections</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fff3e0', color: '#ef6c00' }}>
                <CheckCircle />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">Agent Tier / Level</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="bold">
              Tier {tier}
            </Typography>
            <Typography variant="caption" color="text.secondary">Next Tier: 50 more collections</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLong color="primary" /> Commission Ledger
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Collection ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Commission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.id}</TableCell>
                <TableCell>{row.produceType}</TableCell>
                <TableCell>{row.weightKg} KG</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'PAID' ? 'success' : 'warning'}
                    variant="outlined"
                    sx={{ borderRadius: 1.5, fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  KES 500.00
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {payoutResult && (
        <Alert severity={payoutResult.ok ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 3 }}>
          {payoutResult.message}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f8e9', border: '1px solid #c8e6c9' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RequestQuote fontSize="small" color="primary" /> Payout Terms
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Commissions are only eligible for payout after the <strong>Collection Agent signature</strong>. Payouts are processed every Friday. Minimum payout amount is KES 2,000.
        </Typography>
      </Paper>
    </Container>
  );
}
