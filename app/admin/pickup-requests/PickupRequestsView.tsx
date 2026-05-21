'use client';
import React, { useState, use } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField,
  Chip, Alert, CircularProgress, MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';
import { Add, Visibility, CheckCircle, Cancel, Assignment, TransferWithinAStation } from '@mui/icons-material';
import type { PickupRequest, PickupRequestAuditLog, PickupRequestTransfer } from '@/app/lib/types';
import { Can } from '@/components/Can';
import {
  createPickupRequest, approvePickupRequest, assignPickupRequest, acceptPickupRequest,
  rejectPickupRequest, transferPickupRequest, completePickupRequest, cancelPickupRequest,
  acceptTransfer, rejectTransfer, adminApproveTransfer, getPickupRequestAuditLogs,
} from './actions';

const statusColors: Record<string, string> = {
  PENDING_APPROVAL: '#ff9800', APPROVED: '#2196f3', ASSIGNED: '#9c27b0',
  ACCEPTED: '#4caf50', FLOATING: '#607d8b', REJECTED: '#f44336',
  TRANSFERRED: '#00bcd4', TRANSFER_REJECTED: '#ff5722', COMPLETED: '#2e7d32', CANCELLED: '#e0e0e0',
};

export default function PickupRequestsView({ dataPromise }: { dataPromise: Promise<{ data: PickupRequest[] | null; error: string | null }> }) {
  const { data: initialData, error: fetchError } = use(dataPromise);
  const [requests, setRequests] = useState<PickupRequest[]>(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(fetchError || '');
  const [open, setOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<PickupRequestAuditLog[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'create' | 'approve' | 'assign' | 'reject' | 'transfer' | 'cancel'>('create');
  const [assignTo, setAssignTo] = useState('');
  const [notes, setNotes] = useState('');
  const [formData, setFormData] = useState({ collection_id: '', notes: '' });

  const refresh = async () => {
    const res = await import('./actions').then(m => m.getPickupRequests());
    setRequests(res);
  };

  const handleOpen = (type: typeof dialogType, id?: string) => {
    setDialogType(type);
    setSelectedId(id || null);
    setAssignTo('');
    setNotes('');
    setFormData({ collection_id: '', notes: '' });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (dialogType === 'create') {
        await createPickupRequest(formData);
      } else if (selectedId) {
        switch (dialogType) {
          case 'approve': await approvePickupRequest(selectedId, notes); break;
          case 'assign': await assignPickupRequest(selectedId, assignTo, notes); break;
          case 'reject': await rejectPickupRequest(selectedId, notes); break;
          case 'transfer': await transferPickupRequest(selectedId, assignTo, notes); break;
          case 'cancel': await cancelPickupRequest(selectedId, notes); break;
        }
      }
      await refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try { setLoading(true); await acceptPickupRequest(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const handleComplete = async (id: string) => {
    try { setLoading(true); await completePickupRequest(id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed'); }
    finally { setLoading(false); }
  };

  const handleAudit = async (id: string) => {
    try {
      setLoading(true);
      const logs = await getPickupRequestAuditLogs(id);
      setAuditLogs(logs);
      setSelectedId(id);
      setAuditOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferAction = async (transferId: string, action: 'accept' | 'reject' | 'admin-approve') => {
    try {
      setLoading(true);
      if (action === 'accept') await acceptTransfer(transferId);
      else if (action === 'reject') await rejectTransfer(transferId);
      else await adminApproveTransfer(transferId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const getTransferStatus = (req: PickupRequest): PickupRequestTransfer | undefined => {
    return req.transfers?.find(t => t.status === 'PENDING_ACCEPTANCE');
  };

  const dialogTitle = () => {
    switch (dialogType) {
      case 'create': return 'Create Pickup Request';
      case 'approve': return 'Approve Pickup Request';
      case 'assign': return 'Assign Collection Agent';
      case 'reject': return 'Reject Assignment';
      case 'transfer': return 'Transfer to Another Agent';
      case 'cancel': return 'Cancel Pickup Request';
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Can permission="collection.notification.create">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen('create')} sx={{ borderRadius: 3, fontWeight: 'bold' }}>
            New Pickup Request
          </Button>
        </Can>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Request #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Store Agent</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No pickup requests found.</TableCell></TableRow>
            )}
            {requests.map((req) => (
              <TableRow key={req.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{req.request_number}</TableCell>
                <TableCell>
                  <Chip label={req.status} size="small" sx={{ fontWeight: 'bold', color: '#fff', bgcolor: statusColors[req.status] || '#999', borderRadius: 2 }} />
                </TableCell>
                <TableCell>{req.store_agent?.first_name} {req.store_agent?.last_name}</TableCell>
                <TableCell>{req.assigned_agent ? `${req.assigned_agent.first_name} ${req.assigned_agent.last_name}` : '-'}</TableCell>
                <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton size="small" onClick={() => handleAudit(req.id)} title="Audit Log"><Visibility fontSize="small" /></IconButton>
                    {req.status === 'PENDING_APPROVAL' && (
                      <Can permission="collection.notification.approve">
                        <IconButton size="small" color="success" onClick={() => handleOpen('approve', req.id)} title="Approve"><CheckCircle fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleOpen('cancel', req.id)} title="Cancel"><Cancel fontSize="small" /></IconButton>
                      </Can>
                    )}
                    {req.status === 'APPROVED' && (
                      <Can permission="collection.notification.assign">
                        <IconButton size="small" color="primary" onClick={() => handleOpen('assign', req.id)} title="Assign Agent"><Assignment fontSize="small" /></IconButton>
                      </Can>
                    )}
                    {req.status === 'ASSIGNED' && (
                      <>
                        <IconButton size="small" color="success" onClick={() => handleAccept(req.id)} title="Accept"><CheckCircle fontSize="small" /></IconButton>
                        <IconButton size="small" color="warning" onClick={() => handleOpen('reject', req.id)} title="Reject"><Cancel fontSize="small" /></IconButton>
                        <IconButton size="small" color="info" onClick={() => handleOpen('transfer', req.id)} title="Transfer"><TransferWithinAStation fontSize="small" /></IconButton>
                      </>
                    )}
                    {req.status === 'ACCEPTED' && (
                      <IconButton size="small" color="success" onClick={() => handleComplete(req.id)} title="Complete"><CheckCircle fontSize="small" /></IconButton>
                    )}
                    {req.status === 'FLOATING' && (
                      <Can permission="collection.notification.assign">
                        <IconButton size="small" color="primary" onClick={() => handleOpen('assign', req.id)} title="Reassign"><Assignment fontSize="small" /></IconButton>
                      </Can>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: '900' }}>{dialogTitle()}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {dialogType === 'create' && (
              <>
                <TextField label="Collection ID" fullWidth value={formData.collection_id} onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField label="Notes" fullWidth multiline rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              </>
            )}
            {(dialogType === 'assign' || dialogType === 'transfer') && (
              <>
                <TextField label="Agent User ID" fullWidth value={assignTo} onChange={(e) => setAssignTo(e.target.value)} placeholder="UUID of the agent" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                <TextField label="Notes" fullWidth multiline rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              </>
            )}
            {(dialogType === 'approve' || dialogType === 'reject' || dialogType === 'cancel') && (
              <TextField label="Notes" fullWidth multiline rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={auditOpen} onClose={() => setAuditOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: '900' }}>Audit Trail</DialogTitle>
        <DialogContent>
          {auditLogs.length === 0 ? (
            <Typography color="text.secondary">No audit logs found.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell><Chip label={log.action} size="small" sx={{ fontWeight: 'bold', borderRadius: 2 }} /></TableCell>
                      <TableCell>{log.from_status}</TableCell>
                      <TableCell>{log.to_status}</TableCell>
                      <TableCell>{log.actor?.first_name} {log.actor?.last_name}</TableCell>
                      <TableCell>{log.notes || '-'}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {selectedId && requests.find(r => r.id === selectedId)?.transfers && requests.find(r => r.id === selectedId)!.transfers!.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Transfers</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests.find(r => r.id === selectedId)!.transfers!.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.from_agent?.first_name} {t.from_agent?.last_name}</TableCell>
                        <TableCell>{t.to_agent?.first_name} {t.to_agent?.last_name}</TableCell>
                        <TableCell><Chip label={t.status} size="small" sx={{ fontWeight: 'bold', borderRadius: 2 }} /></TableCell>
                        <TableCell>
                          {t.status === 'PENDING_ACCEPTANCE' && (
                            <Stack direction="row" spacing={0.5}>
                              <IconButton size="small" color="success" onClick={() => handleTransferAction(t.id, 'accept')} title="Accept Transfer"><CheckCircle fontSize="small" /></IconButton>
                              <IconButton size="small" color="error" onClick={() => handleTransferAction(t.id, 'reject')} title="Reject Transfer"><Cancel fontSize="small" /></IconButton>
                            </Stack>
                          )}
                          {t.status === 'ACCEPTED' && (
                            <Can permission="collection.notification.approve">
                              <Button size="small" variant="outlined" onClick={() => handleTransferAction(t.id, 'admin-approve')} sx={{ borderRadius: 2, fontSize: '0.7rem' }}>
                                Admin Approve
                              </Button>
                            </Can>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAuditOpen(false)} sx={{ fontWeight: 'bold' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
