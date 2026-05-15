'use client';

import React, { useState } from 'react';
import {
  Container, Box, Typography, Grid, Paper, Stack, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert, Snackbar, LinearProgress,
} from '@mui/material';
import {
  AccountBalance, Add, CheckCircle, HourglassEmpty, Cancel, Info,
} from '@mui/icons-material';
import type { Loan } from '@/app/lib/types';

export default function LoansView({
  loans,
  collections,
  farmerId,
}: {
  loans: Loan[];
  collections: any[];
  farmerId: string;
}) {
  const [open, setOpen] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const activeLoans = loans.filter(l => l.status === 'ACTIVE');
  const totalBalance = activeLoans.reduce((sum, l) => sum + l.remainingBalance, 0);
  const totalPrincipal = activeLoans.reduce((sum, l) => sum + l.principalAmount, 0);

  const statusColors: Record<string, 'warning' | 'success' | 'error' | 'info'> = {
    PENDING: 'warning', ACTIVE: 'info', PAID: 'success', REJECTED: 'error',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Loans
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Apply for input financing and track your loan repayments.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#e3f2fd', color: '#1565c0' }}><AccountBalance /></Box>
              <Typography variant="subtitle2" color="text.secondary">Active Loans</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="bold">{activeLoans.length}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fff3e0', color: '#ef6c00' }}><Info /></Box>
              <Typography variant="subtitle2" color="text.secondary">Outstanding Balance</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="bold">KES {totalBalance.toLocaleString()}</Typography>
            {totalPrincipal > 0 && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Repaid</Typography>
                  <Typography variant="caption" fontWeight="bold">{((1 - totalBalance / totalPrincipal) * 100).toFixed(0)}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(1 - totalBalance / totalPrincipal) * 100} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Need Input Financing?</Typography>
            <Typography variant="body2" sx={{ my: 1, opacity: 0.9 }}>Apply for a loan against your upcoming harvest.</Typography>
            <Button variant="contained" fullWidth startIcon={<Add />} onClick={() => setOpen(true)}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' }, fontWeight: 'bold', borderRadius: 2 }}>
              Apply for Loan
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalance color="primary" /> Loan History
      </Typography>

      {loans.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #eee', textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">No loans yet. Apply for your first loan above.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Loan ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Principal</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map(loan => (
                <TableRow key={loan.id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{loan.id}</TableCell>
                  <TableCell>KES {loan.principalAmount.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>KES {loan.remainingBalance.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip label={loan.status} size="small" color={statusColors[loan.status] || 'default'} variant="outlined" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  <TableCell>{new Date(loan.timestamp).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <LoanApplyDialog open={open} onClose={() => setOpen(false)} farmerId={farmerId}
        collections={collections} onApplied={() => { setOpen(false); setSnackbar({ open: true, message: 'Loan application submitted successfully!', severity: 'success' }); }}
        onError={(msg) => setSnackbar({ open: true, message: msg, severity: 'error' })}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

function LoanApplyDialog({
  open, onClose, farmerId, collections, onApplied, onError,
}: {
  open: boolean; onClose: () => void; farmerId: string; collections: any[];
  onApplied: () => void; onError: (msg: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) { onError('Please enter a valid loan amount'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId, principalAmount: Number(amount), orderId: `MANUAL-${Date.now()}` }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to apply' }));
        throw new Error(err.error || 'Failed to apply for loan');
      }
      onApplied();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to submit loan application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Apply for Input Financing</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Apply for a loan against your harvest. Repayment is automatically deducted from future collection payouts.
          </Typography>
          <TextField fullWidth label="Loan Amount (KES)" type="number" value={amount}
            onChange={e => setAmount(e.target.value)}
            inputProps={{ min: 100 }}
          />
          <TextField fullWidth select label="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)}>
            <MenuItem value="SEEDS">Seeds & Inputs</MenuItem>
            <MenuItem value="FERTILIZER">Fertilizer</MenuItem>
            <MenuItem value="EQUIPMENT">Equipment</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ borderRadius: 2, fontWeight: 'bold' }}>
          {submitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
