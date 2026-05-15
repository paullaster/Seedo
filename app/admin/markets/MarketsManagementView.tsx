'use client';
import React, { useState } from 'react';
import {
  Container, Box, Typography, Paper, Grid, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, InputAdornment, Chip, Alert, CircularProgress, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp, TrendingDown, ArrowBack, Category } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import type { MarketRate } from '@/app/lib/types';
import { Can } from '@/components/Can';

export default function MarketsManagementView({ initialRates, fetchError }: { initialRates: MarketRate[]; fetchError?: string | null }) {
  const router = useRouter();
  const [rates, setRates] = useState<MarketRate[]>(initialRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(fetchError || '');
  const [open, setOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<MarketRate | null>(null);
  const [formData, setFormData] = useState({ produceType: '', pricePerKg: 0, trend: 'STABLE' as 'UP' | 'DOWN' | 'STABLE', category: '', estimatedRequireQuantity: '' });

  const handleOpen = (rate?: MarketRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({ produceType: rate.produceType, pricePerKg: rate.pricePerKg, trend: rate.trend, category: rate.category || '', estimatedRequireQuantity: rate.estimatedRequireQuantity?.toString() || '' });
    } else {
      setEditingRate(null);
      setFormData({ produceType: '', pricePerKg: 0, trend: 'STABLE', category: '', estimatedRequireQuantity: '' });
    }
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditingRate(null); };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        estimatedRequireQuantity: formData.estimatedRequireQuantity ? parseInt(formData.estimatedRequireQuantity, 10) : undefined,
      };
      if (editingRate) {
        const res = await fetch(`/api/market-rates/${editingRate.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/market-rates', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
      }
      const res = await fetch('/api/market-rates');
      setRates(await res.json());
      handleClose();
    } catch {
      setError('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this produce?')) return;
    try {
      await fetch(`/api/market-rates/${id}`, { method: 'DELETE' });
      setRates(rates.filter(r => r.id !== id));
    } catch {
      setError('Failed to delete');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/admin')} sx={{ mb: 1 }}>Dashboard</Button>
          <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>Market Controls</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>Manage accepted produce and regulate buying prices.</Typography>
        </Box>
        <Can permission="produce.markets.create">
          <Button variant="contained" size="large" startIcon={<Add />} onClick={() => handleOpen()} sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 'bold' }}>
            Add New Produce
          </Button>
        </Can>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}

      <Grid container spacing={3}>
        {rates.map((rate) => (
          <Grid size={{ xs: 12, md: 4 }} key={rate.id}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #eee', transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderColor: 'primary.main' } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight="900" color="primary">{rate.produceType}</Typography>
                  <Typography variant="caption" color="text.secondary">Last Updated: {new Date(rate.lastUpdated).toLocaleDateString()}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Can permission="produce.markets.update">
                    <IconButton size="small" onClick={() => handleOpen(rate)} color="primary"><Edit fontSize="small" /></IconButton>
                  </Can>
                  <Can permission="produce.markets.delete">
                    <IconButton size="small" onClick={() => handleDelete(rate.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </Can>
                </Stack>
              </Stack>
              {rate.category && (
                <Chip label={rate.category} size="small" icon={<Category fontSize="small" />} variant="outlined" sx={{ mb: 1.5, fontWeight: 500, textTransform: 'capitalize' }} />
              )}
              <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 3, mb: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">CURRENT BUYING RATE</Typography>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography variant="h4" fontWeight="900">KES {rate.pricePerKg}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">/ KG</Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip label={rate.trend} size="small" color={rate.trend === 'UP' ? 'success' : rate.trend === 'DOWN' ? 'error' : 'default'} icon={rate.trend === 'UP' ? <TrendingUp /> : rate.trend === 'DOWN' ? <TrendingDown /> : undefined} sx={{ fontWeight: 'bold' }} />
                <Typography variant="caption" color="text.secondary">Market Sentiment</Typography>
                {rate.estimatedRequireQuantity != null && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    Est. Required: {rate.estimatedRequireQuantity.toLocaleString()} KG
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: '900', fontSize: '1.5rem' }}>{editingRate ? 'Edit Produce' : 'Add New Produce'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Produce Name" fullWidth value={formData.produceType} onChange={(e) => setFormData({ ...formData, produceType: e.target.value })} placeholder="e.g. Maize, Sorghum, Wheat" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Buying Rate (KES/KG)" fullWidth type="number" value={formData.pricePerKg} onChange={(e) => setFormData({ ...formData, pricePerKg: parseFloat(e.target.value) || 0 })} InputProps={{ startAdornment: <InputAdornment position="start">KES</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField
              select label="Category" fullWidth value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="CEREALS">Cereals</MenuItem>
              <MenuItem value="LEGUMES">Legumes</MenuItem>
              <MenuItem value="VEGETABLES">Vegetables</MenuItem>
              <MenuItem value="FRUITS">Fruits</MenuItem>
              <MenuItem value="ALLIUMS">Alliums</MenuItem>
              <MenuItem value="NUTS_and_SEEDS">Nuts & Seeds</MenuItem>
              <MenuItem value="PSEUDO_CEREALS">Pseudo Cereals</MenuItem>
            </TextField>
            <TextField label="Est. Required Quantity (KG)" fullWidth type="number" value={formData.estimatedRequireQuantity}
              onChange={(e) => setFormData({ ...formData, estimatedRequireQuantity: e.target.value })}
              helperText="Optional: estimated quantity needed for purchases"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, ml: 1 }}>Market Trend</Typography>
              <Stack direction="row" spacing={1}>
                {['UP', 'STABLE', 'DOWN'].map((t) => (
                  <Chip key={t} label={t} onClick={() => setFormData({ ...formData, trend: t as any })} color={formData.trend === t ? 'primary' : 'default'} variant={formData.trend === t ? 'filled' : 'outlined'} sx={{ flex: 1, py: 2.5, borderRadius: 2, fontWeight: 'bold' }} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}>{editingRate ? 'Update Product' : 'Register Product'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
