'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Drawer,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
  Grid,
} from '@mui/material';
import {
  AccountBalanceWallet,
  HistoryEdu,
  CheckCircle,
  Block,
  Visibility,
  Edit,
  Update,
  Event,
  Timer,
} from '@mui/icons-material';
import { Loan, Farmer } from '@/app/lib/types';
import { apiService } from '@/app/lib/api-service';
import { Can } from '@/components/Can';

const LoanManagement = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newBalance, setNewBalance] = useState<number>(0);

  const fetchLoans = async () => {
    try {
      const data = await apiService.getLoans();
      setLoans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (id: string, newStatus: string) => {
    try {
      await apiService.updateLoanStatus(id, { status: newStatus });
      fetchLoans();
    } catch (err) {
      alert('Failed to update loan status');
    }
  };

  const handleUpdateBalance = async () => {
    if (!activeLoan) return;
    try {
      await apiService.updateLoanStatus(activeLoan.id, { remainingBalance: newBalance });
      fetchLoans();
      setEditMode(false);
      setDrawerOpen(false);
    } catch (err) {
      alert('Failed to update balance');
    }
  };

  const openDetails = (loan: Loan) => {
    setActiveLoan(loan);
    setNewBalance(loan.remainingBalance);
    setDrawerOpen(true);
    setEditMode(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Loan Portfolio Overview</Typography>
          <Typography variant="body2" color="text.secondary">Monitor repayment health and verify automated recoveries.</Typography>
        </Box>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Loanee (ID)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Principal</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Remaining Balance</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Expected Recovery</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{loan.farmerId}</Typography>
                  <Typography variant="caption" color="text.secondary">Order: {loan.orderId}</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>KES {loan.principalAmount.toLocaleString()}</TableCell>
                <TableCell sx={{ color: loan.remainingBalance > 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                  KES {loan.remainingBalance.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={loan.status}
                    size="small"
                    color={loan.status === 'ACTIVE' ? 'primary' : loan.status === 'PAID' ? 'success' : 'default'}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Event fontSize="inherit" color="action" />
                    <Typography variant="caption" fontWeight="bold">
                      {loan.expectedRecoveryDate || 'Next Harvest'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {loan.status === 'PENDING' && (
                      <Can permission="loans.update">
                        <>
                          <Button size="small" variant="contained" color="success" onClick={() => handleAction(loan.id, 'ACTIVE')}>Approve</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleAction(loan.id, 'REJECTED')}>Reject</Button>
                        </>
                      </Can>
                    )}
                    <Tooltip title="View Detailed Ledger">
                      <IconButton size="small" onClick={() => openDetails(loan)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Loan Detail & Adjustment Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}
      >
        {activeLoan && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="900">Loan Ledger Analysis</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}><Block /></IconButton>
            </Stack>

            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 4, mb: 4 }}>
              <Typography variant="caption" color="text.secondary" display="block">REPAYMENT PROGRESS</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 1 }}>
                <Typography variant="h4" fontWeight="900">
                  {Math.round(((activeLoan.principalAmount - activeLoan.remainingBalance) / activeLoan.principalAmount) * 100)}%
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  KES {(activeLoan.principalAmount - activeLoan.remainingBalance).toLocaleString()} Recovered
                </Typography>
              </Stack>
            </Paper>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Farmer Identity Snapshot</Typography>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 3, bgcolor: 'white' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main' }}>F</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{activeLoan.farmerId}</Typography>
                      <Typography variant="caption" color="text.secondary">Verified National ID: 1234****</Typography>
                    </Box>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Loyalty Tier</Typography>
                      <Typography variant="body2" fontWeight="bold">Gold Member</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">Total Deliveries</Typography>
                      <Typography variant="body2" fontWeight="bold">14.2 Tons</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Administrative Overrides</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Manually adjust balance if a cash recovery was made offline.
                </Typography>
                
                {editMode ? (
                  <Stack spacing={2}>
                    <TextField
                      label="Adjust Remaining Balance"
                      fullWidth
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(parseFloat(e.target.value) || 0)}
                      InputProps={{ startAdornment: <InputAdornment position="start">KES</InputAdornment> }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button fullWidth variant="contained" onClick={handleUpdateBalance}>Confirm Sync</Button>
                      <Button fullWidth variant="outlined" onClick={() => setEditMode(false)}>Cancel</Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Button startIcon={<Edit />} variant="outlined" fullWidth onClick={() => setEditMode(true)}>
                    Sync Recovery Balance
                  </Button>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Recovery Timeline</Typography>
                <Stack spacing={2}>
                  {activeLoan.recoveryHistory && activeLoan.recoveryHistory.length > 0 ? (
                    activeLoan.recoveryHistory.map((rec, idx) => (
                      <Paper key={idx} elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 3 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="body2" fontWeight="bold">Deduction from {rec.collectionId}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(rec.timestamp).toLocaleDateString()}</Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="900" color="success.main">- KES {rec.amountRecovered}</Typography>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      No recovery transactions recorded yet.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Drawer>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryEdu fontSize="small" /> Automated Recovery Logic
        </Typography>
        <Typography variant="body2" color="text.secondary">
          System Guardrail: The living wage rule prevents recovery of more than 60% of any single produce payout.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoanManagement;
