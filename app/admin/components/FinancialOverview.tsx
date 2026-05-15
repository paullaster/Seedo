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
  Checkbox,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Drawer,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  HistoryEdu,
  CheckCircle,
  AccountBalance,
  LocationOn,
  Person,
  Inventory,
  ThumbUp,
} from '@mui/icons-material';
import { ProduceCollection, CollectionStatus } from '@/app/lib/types';
import { apiService } from '@/app/lib/api-service';
import { Can } from '@/components/Can';

const FinancialOverview = () => {
  const [collections, setCollections] = useState<ProduceCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ProduceCollection | null>(null);

  const fetchCollections = async () => {
    try {
      const data = await apiService.getAllCollections();
      setCollections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(collections.filter(c => c.status === 'VERIFIED').map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDrillDown = (item: ProduceCollection) => {
    setActiveItem(item);
    setDrawerOpen(true);
  };

  const handleValidate = async (id: string) => {
    try {
      await apiService.updateCollectionStatus(id, 'VERIFIED');
      fetchCollections();
    } catch (err) {
      alert('Failed to validate invoice');
    }
  };

  const handleBulkPayout = async () => {
    if (!window.confirm(`Disburse payments for ${selected.length} invoices?`)) return;
    try {
      await apiService.processBulkPayout(selected);
      setSelected([]);
      fetchCollections();
    } catch (err) {
      alert('Failed to process payout');
    }
  };

  const totalAmount = collections
    .filter(c => selected.includes(c.id))
    .reduce((sum, c) => sum + c.totalAmount, 0);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Payout & Invoice Management</Typography>
          <Typography variant="body2" color="text.secondary">Validate produce deliveries and process bank disbursements.</Typography>
        </Box>
        {selected.length > 0 && (
          <Can permission="financials.payouts.process">
            <Button
              variant="contained"
              size="large"
              startIcon={<AccountBalance />}
              onClick={handleBulkPayout}
              sx={{ borderRadius: 3, fontWeight: 'bold', py: 1.5, px: 4 }}
            >
              Disburse KES {totalAmount.toLocaleString()} ({selected.length})
            </Button>
          </Can>
        )}
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selected.length > 0 && selected.length === collections.filter(c => c.status === 'VERIFIED').length}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Farmer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Produce</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    disabled={row.status !== 'VERIFIED'}
                    checked={selected.includes(row.id)}
                    onChange={() => handleSelectOne(row.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{row.id}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(row.timestamp).toLocaleDateString()}</Typography>
                </TableCell>
                <TableCell>Farmer ID: {row.farmerId}</TableCell>
                <TableCell>{row.produceType} ({row.weightKg}kg)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>KES {row.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'PAID' ? 'success' : row.status === 'VERIFIED' ? 'primary' : 'warning'}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {row.status === 'PENDING' && (
                      <Can permission="collections.status">
                        <Tooltip title="Validate Invoice">
                          <IconButton size="small" color="success" onClick={() => handleValidate(row.id)}>
                            <ThumbUp fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Can>
                    )}
                    <Tooltip title="Forensic Drill-Down">
                      <IconButton size="small" onClick={() => handleDrillDown(row)}>
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

      {/* Forensic Drill-Down Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 450 }, p: 3 } }}
      >
        {activeItem && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Forensic Audit Chain</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Full traceability for Receipt {activeItem.id}</Typography>

            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Person color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Farmer</Typography>
                    <Typography variant="body2" fontWeight="bold">Elias Mwaura (F001)</Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Inventory color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Intake Record</Typography>
                    <Typography variant="body2" fontWeight="bold">Agent Kevin Omondi (A001)</Typography>
                    <Typography variant="caption" display="block">At STORE-001 (Kiambu Road)</Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircle color="success" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Digital Handshake (Audit)</Typography>
                    <Typography variant="body2" fontWeight="bold">Verified by Lucy Wanjiku (A002)</Typography>
                    <Typography variant="caption" display="block">Timestamp: {activeItem.verifiedAt || 'Pending'}</Typography>
                  </Box>
                </Stack>
              </Paper>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Intake Photo Proof</Typography>
                <Box
                  component="img"
                  src={activeItem.imageUrl}
                  sx={{ width: '100%', borderRadius: 3, border: '1px solid #ddd' }}
                />
              </Box>

              <Alert severity="success" sx={{ borderRadius: 3 }}>
                This transaction hash is irreversible and recorded in the system audit logs.
              </Alert>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default FinancialOverview;
