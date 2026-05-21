'use client';
import React, { useState, use } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField,
  Chip, Alert, CircularProgress, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, Storage, Inventory, Layers } from '@mui/icons-material';
import type { Warehouse, Bin, SubBin } from '@/app/lib/types';
import { Can } from '@/components/Can';
import {
  createWarehouse, updateWarehouse, deleteWarehouse,
  createBin, updateBin, deleteBin,
  createSubBin, updateSubBin, deleteSubBin,
} from './actions';

export default function WarehousesView({ dataPromise }: { dataPromise: Promise<{ data: Warehouse[] | null; error: string | null }> }) {
  const { data: initialData, error: fetchError } = use(dataPromise);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(fetchError || '');
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'wh' | 'bin' | 'sub'>('wh');
  const [editing, setEditing] = useState<any>(null);
  const [parentId, setParentId] = useState<string>('');
  const [form, setForm] = useState({ name: '', code: '', location: '', max_capacity: '' });

  const refresh = async () => {
    const res = await import('./actions').then(m => m.getWarehouses());
    setWarehouses(res);
  };

  const handleOpen = (type: 'wh' | 'bin' | 'sub', parent?: string, item?: any) => {
    setDialogType(type);
    setParentId(parent || '');
    setEditing(item || null);
    setForm({
      name: item?.name || '',
      code: item?.code || '',
      location: item?.location || '',
      max_capacity: item?.max_capacity?.toString() || '',
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload: any = { name: form.name, code: form.code };
      if (dialogType === 'wh') payload.location = form.location;
      else payload.max_capacity = form.max_capacity ? parseFloat(form.max_capacity) : undefined;

      if (editing) {
        if (dialogType === 'wh') await updateWarehouse(editing.id, payload);
        else if (dialogType === 'bin') await updateBin(editing.id, payload);
        else await updateSubBin(editing.id, payload);
      } else {
        if (dialogType === 'wh') await createWarehouse(payload);
        else if (dialogType === 'bin') await createBin({ ...payload, warehouse_id: parentId });
        else await createSubBin({ ...payload, bin_id: parentId });
      }
      await refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'wh' | 'bin' | 'sub', id: string) => {
    if (!window.confirm('Are you sure? This will soft-delete this item.')) return;
    try {
      setLoading(true);
      if (type === 'wh') await deleteWarehouse(id);
      else if (type === 'bin') await deleteBin(id);
      else await deleteSubBin(id);
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
        <Can permission="warehouse.manage">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen('wh')} sx={{ borderRadius: 3, fontWeight: 'bold' }}>
            New Warehouse
          </Button>
        </Can>
      </Box>

      {warehouses.length === 0 && !loading && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eee', textAlign: 'center', color: 'text.secondary' }}>
          No warehouses found. Create one to get started.
        </Paper>
      )}

      {warehouses.map((wh) => (
        <Accordion key={wh.id} elevation={0} sx={{ mb: 1, borderRadius: '12px !important', border: '1px solid #eee', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#f8f9fa' } }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Storage color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">{wh.name}</Typography>
                <Typography variant="caption" color="text.secondary">Code: {wh.code} | Location: {wh.location || '-'}</Typography>
              </Box>
              <Chip label={wh.is_active ? 'Active' : 'Inactive'} size="small" color={wh.is_active ? 'success' : 'default'} sx={{ fontWeight: 'bold', borderRadius: 2 }} />
              <Can permission="warehouse.manage">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen('wh', undefined, wh); }} color="primary"><Edit fontSize="small" /></IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete('wh', wh.id); }} color="error"><Delete fontSize="small" /></IconButton>
              </Can>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: '1px solid #eee', pt: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Inventory fontSize="small" /> Bins
              </Typography>
              <Can permission="warehouse.manage">
                <Button size="small" startIcon={<Add />} onClick={() => handleOpen('bin', wh.id)} sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                  Add Bin
                </Button>
              </Can>
            </Stack>
            {(!wh.bins || wh.bins.length === 0) ? (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>No bins in this warehouse.</Typography>
            ) : (
              wh.bins.map((bin) => (
                <Accordion key={bin.id} elevation={0} sx={{ ml: 4, mb: 0.5, borderRadius: '8px !important', border: '1px solid #f0f0f0', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ borderRadius: 1, minHeight: 40, '& .MuiAccordionSummary-content': { my: 1 } }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                      <Inventory fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={600}>{bin.name}</Typography>
                      <Typography variant="caption" color="text.secondary">({bin.code})</Typography>
                      {bin.max_capacity && <Typography variant="caption" color="text.secondary">Cap: {bin.max_capacity}</Typography>}
                      <Chip label={bin.is_active ? 'Active' : 'Inactive'} size="small" color={bin.is_active ? 'success' : 'default'} sx={{ fontWeight: 'bold', borderRadius: 2, height: 20, fontSize: '0.65rem' }} />
                      <Box sx={{ ml: 'auto' }}>
                        <Can permission="warehouse.manage">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen('bin', wh.id, bin); }} color="primary"><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete('bin', bin.id); }} color="error"><Delete fontSize="small" /></IconButton>
                        </Can>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ borderTop: '1px solid #f0f0f0', pt: 1, pb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Layers fontSize="inherit" /> Sub-Bins
                      </Typography>
                      <Can permission="warehouse.manage">
                        <Button size="small" startIcon={<Add />} onClick={() => handleOpen('sub', bin.id)} sx={{ borderRadius: 2, fontSize: '0.7rem', fontWeight: 'bold' }}>
                          Add
                        </Button>
                      </Can>
                    </Stack>
                    {(!bin.sub_bins || bin.sub_bins.length === 0) ? (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>No sub-bins.</Typography>
                    ) : (
                      bin.sub_bins.map((sb) => (
                        <Stack key={sb.id} direction="row" spacing={1} alignItems="center" sx={{ ml: 4, py: 0.5, borderBottom: '1px solid #f5f5f5' }}>
                          <Layers fontSize="small" color="disabled" />
                          <Typography variant="body2">{sb.name}</Typography>
                          <Typography variant="caption" color="text.secondary">({sb.code})</Typography>
                          {sb.max_capacity && <Typography variant="caption" color="text.secondary">Cap: {sb.max_capacity}</Typography>}
                          <Chip label={sb.is_active ? 'Active' : 'Inactive'} size="small" color={sb.is_active ? 'success' : 'default'} sx={{ fontWeight: 'bold', borderRadius: 2, height: 18, fontSize: '0.6rem' }} />
                          <Can permission="warehouse.manage">
                            <IconButton size="small" onClick={() => handleOpen('sub', bin.id, sb)} color="primary"><Edit fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDelete('sub', sb.id)} color="error"><Delete fontSize="small" /></IconButton>
                          </Can>
                        </Stack>
                      ))
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: '900' }}>
          {editing ? 'Edit' : 'New'} {dialogType === 'wh' ? 'Warehouse' : dialogType === 'bin' ? 'Bin' : 'Sub-Bin'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Code" fullWidth value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            {dialogType === 'wh' && (
              <TextField label="Location" fullWidth value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            )}
            {dialogType !== 'wh' && (
              <TextField label="Max Capacity" fullWidth type="number" value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            )}
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
