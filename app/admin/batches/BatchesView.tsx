'use client';
import React, { useState, use } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField,
  Chip, Alert, CircularProgress, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { Batch } from '@/app/lib/types';
import { Can } from '@/components/Can';
import { createBatch, updateBatch, deleteBatch } from './actions';

export default function BatchesView({ dataPromise }: { dataPromise: Promise<{ data: Batch[] | null; error: string | null }> }) {
  const { data: initialData, error: fetchError } = use(dataPromise);
  const [batches, setBatches] = useState<Batch[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(fetchError || '');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Batch | null>(null);
  const [form, setForm] = useState({
    produce_id: '', warehouse_id: '', quantity: 0, received_date: '',
    source: 'MANUAL', bin_id: '', sub_bin_id: '', expiry_date: '', notes: '',
  });

  const refresh = async () => {
    const res = await import('./actions').then(m => m.getBatches());
    setBatches(res);
  };

  const handleOpen = (batch?: Batch) => {
    if (batch) {
      setEditing(batch);
      setForm({
        produce_id: batch.produce_id, warehouse_id: batch.warehouse_id,
        quantity: batch.quantity, received_date: batch.received_date?.split('T')[0] || '',
        source: batch.source, bin_id: batch.bin_id || '', sub_bin_id: batch.sub_bin_id || '',
        expiry_date: batch.expiry_date?.split('T')[0] || '', notes: batch.notes || '',
      });
    } else {
      setEditing(null);
      setForm({ produce_id: '', warehouse_id: '', quantity: 0, received_date: '', source: 'MANUAL', bin_id: '', sub_bin_id: '', expiry_date: '', notes: '' });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editing) {
        await updateBatch(editing.id, form);
      } else {
        await createBatch(form);
      }
      await refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this batch?')) return;
    try {
      setLoading(true);
      await deleteBatch(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Can permission="batch.manage">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ borderRadius: 3, fontWeight: 'bold' }}>New Batch</Button>
        </Can>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Produce</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity (KG)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Received</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batches.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No batches found.</TableCell></TableRow>
            )}
            {batches.map((b) => (
              <TableRow key={b.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{b.batch_number}</TableCell>
                <TableCell>{b.produce?.name || b.produce_id}</TableCell>
                <TableCell>{b.warehouse?.name || b.warehouse_id}</TableCell>
                <TableCell>{Number(b.quantity).toLocaleString()}</TableCell>
                <TableCell><Chip label={b.source} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 'bold' }} /></TableCell>
                <TableCell>{new Date(b.received_date).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Can permission="batch.manage">
                    <IconButton size="small" onClick={() => handleOpen(b)} color="primary"><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(b.id)} color="error"><Delete fontSize="small" /></IconButton>
                  </Can>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: '900' }}>{editing ? 'Edit Batch' : 'New Batch'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Produce ID" fullWidth value={form.produce_id} onChange={(e) => setForm({ ...form, produce_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Warehouse ID" fullWidth value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Quantity (KG)" fullWidth type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseFloat(e.target.value) || 0 })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Received Date" fullWidth type="date" value={form.received_date} onChange={(e) => setForm({ ...form, received_date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Expiry Date" fullWidth type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField select label="Source" fullWidth value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
              <MenuItem value="MANUAL">Manual</MenuItem>
              <MenuItem value="DELIVERY_NOTE">Delivery Note</MenuItem>
              <MenuItem value="PURCHASE">Purchase</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
            </TextField>
            <TextField label="Bin ID" fullWidth value={form.bin_id} onChange={(e) => setForm({ ...form, bin_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Sub-Bin ID" fullWidth value={form.sub_bin_id} onChange={(e) => setForm({ ...form, sub_bin_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
