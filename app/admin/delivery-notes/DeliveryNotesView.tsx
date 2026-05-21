'use client';
import React, { useState, use } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField,
  Chip, Alert, CircularProgress, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { Add, EditNote, ExpandMore, CheckCircle, Cancel } from '@mui/icons-material';
import type { DeliveryNoteHeader } from '@/app/lib/types';
import { Can } from '@/components/Can';
import { createDeliveryNote, confirmDeliveryNote, cancelDeliveryNote, deleteDeliveryNote, getDeliveryNote } from './actions';

const statusColors: Record<string, string> = {
  DRAFT: '#ff9800', CONFIRMED: '#4caf50', CANCELLED: '#f44336',
};

export default function DeliveryNotesView({ dataPromise }: { dataPromise: Promise<{ data: DeliveryNoteHeader[] | null; error: string | null }> }) {
  const { data: initialData, error: fetchError } = use(dataPromise);
  const [notes, setNotes] = useState<DeliveryNoteHeader[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(fetchError || '');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<DeliveryNoteHeader | null>(null);
  const [form, setForm] = useState({
    pickup_request_id: '', warehouse_id: '', received_by: '', delivery_date: '', notes: '',
    lines: [{ produce_id: '', quantity_received: 0, bin_id: '', sub_bin_id: '', notes: '' }],
  });

  const refresh = async () => {
    const res = await import('./actions').then(m => m.getDeliveryNotes());
    setNotes(res);
  };

  const handleOpen = () => {
    setForm({ pickup_request_id: '', warehouse_id: '', received_by: '', delivery_date: new Date().toISOString().split('T')[0], notes: '', lines: [{ produce_id: '', quantity_received: 0, bin_id: '', sub_bin_id: '', notes: '' }] });
    setOpen(true);
  };

  const handleDetail = async (id: string) => {
    try {
      setLoading(true);
      const dn = await getDeliveryNote(id);
      setSelectedNote(dn);
      setDetailOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLineChange = (idx: number, field: string, value: any) => {
    const lines = [...form.lines];
    (lines[idx] as any)[field] = value;
    setForm({ ...form, lines });
  };

  const addLine = () => {
    setForm({ ...form, lines: [...form.lines, { produce_id: '', quantity_received: 0, bin_id: '', sub_bin_id: '', notes: '' }] });
  };

  const removeLine = (idx: number) => {
    if (form.lines.length <= 1) return;
    setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createDeliveryNote(form);
      await refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try { setLoading(true); await confirmDeliveryNote(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id: string) => {
    try { setLoading(true); await cancelDeliveryNote(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this delivery note?')) return;
    try { setLoading(true); await deleteDeliveryNote(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Can permission="delivery-note.create">
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ borderRadius: 3, fontWeight: 'bold' }}>New Delivery Note</Button>
        </Can>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>DN #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Received By</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lines</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No delivery notes found.</TableCell></TableRow>
            )}
            {notes.map((dn) => (
              <TableRow key={dn.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{dn.delivery_note_number}</TableCell>
                <TableCell>
                  <Chip label={dn.status} size="small" sx={{ fontWeight: 'bold', color: '#fff', bgcolor: statusColors[dn.status] || '#999', borderRadius: 2 }} />
                </TableCell>
                <TableCell>{dn.warehouse?.name || '-'}</TableCell>
                <TableCell>{dn.received_by}</TableCell>
                <TableCell>{new Date(dn.delivery_date).toLocaleDateString()}</TableCell>
                <TableCell>{dn.lines?.length || 0}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDetail(dn.id)} title="View Details"><EditNote fontSize="small" /></IconButton>
                  {dn.status === 'DRAFT' && (
                    <>
                      <IconButton size="small" color="success" onClick={() => handleConfirm(dn.id)} title="Confirm"><CheckCircle fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleCancel(dn.id)} title="Cancel"><Cancel fontSize="small" /></IconButton>
                    </>
                  )}
                  <Can permission="delivery-note.manage">
                    <IconButton size="small" color="error" onClick={() => handleDelete(dn.id)}><Cancel fontSize="small" /></IconButton>
                  </Can>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: '900' }}>New Delivery Note</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2}>
              <TextField label="Pickup Request ID" fullWidth value={form.pickup_request_id} onChange={(e) => setForm({ ...form, pickup_request_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField label="Warehouse ID" fullWidth value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Received By" fullWidth value={form.received_by} onChange={(e) => setForm({ ...form, received_by: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField label="Delivery Date" fullWidth type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            </Stack>
            <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Lines</Typography>
            {form.lines.map((line, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Produce ID" size="small" fullWidth value={line.produce_id} onChange={(e) => handleLineChange(idx, 'produce_id', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    <TextField label="Quantity (KG)" size="small" type="number" fullWidth value={line.quantity_received} onChange={(e) => handleLineChange(idx, 'quantity_received', parseFloat(e.target.value) || 0)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Bin ID" size="small" fullWidth value={line.bin_id} onChange={(e) => handleLineChange(idx, 'bin_id', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    <TextField label="Sub-Bin ID" size="small" fullWidth value={line.sub_bin_id} onChange={(e) => handleLineChange(idx, 'sub_bin_id', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField label="Notes" size="small" fullWidth value={line.notes} onChange={(e) => handleLineChange(idx, 'notes', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    {form.lines.length > 1 && (
                      <Button size="small" color="error" onClick={() => removeLine(idx)} sx={{ borderRadius: 2 }}>Remove</Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            ))}
            <Button variant="outlined" onClick={addLine} sx={{ borderRadius: 3, fontWeight: 'bold' }}>+ Add Line</Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Delivery Note'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: '900' }}>Delivery Note Details</DialogTitle>
        <DialogContent>
          {selectedNote && (
            <Stack spacing={2}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold">{selectedNote.delivery_note_number}</Typography>
                <Typography variant="body2" color="text.secondary">Status: <Chip label={selectedNote.status} size="small" sx={{ fontWeight: 'bold', color: '#fff', bgcolor: statusColors[selectedNote.status] || '#999' }} /></Typography>
                <Typography variant="body2" color="text.secondary">Warehouse: {selectedNote.warehouse?.name || selectedNote.warehouse_id}</Typography>
                <Typography variant="body2" color="text.secondary">Received By: {selectedNote.received_by}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {new Date(selectedNote.delivery_date).toLocaleDateString()}</Typography>
                {selectedNote.notes && <Typography variant="body2" color="text.secondary">Notes: {selectedNote.notes}</Typography>}
              </Paper>
              <Typography variant="h6" fontWeight="bold">Lines</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Produce</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Batch</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Bin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedNote.lines?.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>{line.produce?.name || line.produce_id}</TableCell>
                        <TableCell>{Number(line.quantity_received).toLocaleString()} KG</TableCell>
                        <TableCell>{line.batch?.batch_number || line.batch_id}</TableCell>
                        <TableCell>{line.bin?.name || line.bin_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ fontWeight: 'bold' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
