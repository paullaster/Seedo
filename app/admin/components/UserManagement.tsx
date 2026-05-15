'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, Button, MenuItem, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress,
  Divider, Tab, Tabs, Card, CardContent, Autocomplete,
} from '@mui/material';
import {
  PersonAdd, Security, ContentCopy, CheckCircle, Add, Delete,
  Shield, AdminPanelSettings,
} from '@mui/icons-material';
import { apiService } from '@/app/lib/api-service';
import { Can } from '@/components/Can';
import type { Permission, UserPermission, MarketRate } from '@/app/lib/types';

const KNOWN_PERMISSION_KEYS = [
  { key: 'admin.users.create', name: 'Can Create Admin Users' },
  { key: 'admin.users.read', name: 'Can View Users' },
  { key: 'admin.users.update', name: 'Can Edit Users' },
  { key: 'admin.users.delete', name: 'Can Delete Users' },
  { key: 'admin.users.permissions', name: 'Can Manage Permissions' },
  { key: 'produce.markets.create', name: 'Can Create Produce' },
  { key: 'produce.markets.read', name: 'Can View Markets' },
  { key: 'produce.markets.update', name: 'Can Edit Produce' },
  { key: 'produce.markets.delete', name: 'Can Delete Produce' },
  { key: 'collections.create', name: 'Can Create Collections' },
  { key: 'collections.read', name: 'Can View Collections' },
  { key: 'collections.update', name: 'Can Edit Collections' },
  { key: 'collections.status', name: 'Can Change Collection Status' },
  { key: 'collections.delete', name: 'Can Delete Collections' },
  { key: 'financials.payouts.create', name: 'Can Create Payouts' },
  { key: 'financials.payouts.read', name: 'Can View Payouts' },
  { key: 'financials.payouts.process', name: 'Can Process Bulk Payouts' },
  { key: 'financials.payouts.update', name: 'Can Edit Payouts' },
  { key: 'financials.payouts.delete', name: 'Can Delete Payouts' },
  { key: 'loans.create', name: 'Can Create Loans' },
  { key: 'loans.read', name: 'Can View Loans' },
  { key: 'loans.update', name: 'Can Edit Loans' },
  { key: 'loans.recover', name: 'Can Process Loan Recovery' },
  { key: 'loans.delete', name: 'Can Delete Loans' },
  { key: 'harvest.create', name: 'Can Create Harvest Records' },
  { key: 'harvest.update', name: 'Can Edit Harvest Records' },
  { key: 'harvest.delete', name: 'Can Delete Harvest Records' },
  { key: 'harvest.notices.create', name: 'Can Create Harvest Notices' },
  { key: 'harvest.notices.update', name: 'Can Edit Harvest Notices' },
  { key: 'harvest.notices.delete', name: 'Can Delete Harvest Notices' },
  { key: 'wastage.create', name: 'Can Create Wastage Records' },
  { key: 'wastage.delete', name: 'Can Delete Wastage Records' },
  { key: 'settings.read', name: 'Can View Settings' },
  { key: 'settings.update', name: 'Can Update Settings' },
  { key: 'permissions.attributes.create', name: 'Can Create Permission Attributes' },
  { key: 'permissions.attributes.delete', name: 'Can Delete Permission Attributes' },
  { key: 'measurement.units.create', name: 'Can Create Units' },
  { key: 'measurement.units.update', name: 'Can Edit Units' },
  { key: 'measurement.units.delete', name: 'Can Delete Units' },
  { key: 'price.history.create', name: 'Can Create Price History' },
  { key: 'price.history.delete', name: 'Can Delete Price History' },
];

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  verification_status: string;
  is_active: boolean;
  phone_number?: string;
  username?: string;
}

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', role: 'ADMIN' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<{ activationLink: string; user: any } | null>(null);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permLoading, setPermLoading] = useState(false);
  const [newPermOpen, setNewPermOpen] = useState(false);
  const [newPermForm, setNewPermForm] = useState({ key: '', name: '', description: '' });

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTargetUser, setAssignTargetUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [permKeySearch, setPermKeySearch] = useState('');
  const [permKeyOptions, setPermKeyOptions] = useState<{ key: string; name: string }[]>([]);
  const permSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users/all');
      const data = await res.json();
      const items = data.data || data || [];
      setUsers(Array.isArray(items) ? items : []);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    setPermLoading(true);
    try {
      const data = await apiService.getPermissions();
      setPermissions(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setPermLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, [fetchUsers, fetchPermissions]);

  const handlePermKeySearch = (query: string) => {
    setPermKeySearch(query);
    if (permSearchRef.current) clearTimeout(permSearchRef.current);
    permSearchRef.current = setTimeout(() => {
      const filtered = KNOWN_PERMISSION_KEYS.filter(
        (k) => k.key.toLowerCase().includes(query.toLowerCase()) || k.name.toLowerCase().includes(query.toLowerCase()),
      );
      setPermKeyOptions(filtered);
    }, 200);
  };

  const handleCreateUser = async () => {
    setError('');
    setCreateLoading(true);
    setCreateResult(null);
    try {
      const result = await apiService.adminCreateUser(createForm);
      setCreateResult(result);
      setCreateForm({ firstName: '', lastName: '', email: '', role: 'ADMIN' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreatePermission = async () => {
    try {
      await apiService.createPermission(newPermForm);
      setNewPermOpen(false);
      setNewPermForm({ key: '', name: '', description: '' });
      setPermKeySearch('');
      fetchPermissions();
    } catch (err: any) {
      setError(err.message || 'Failed to create permission');
    }
  };

  const handleDeletePermission = async (id: string) => {
    if (!window.confirm('Delete this permission attribute? It will be removed from all users.')) return;
    try {
      await apiService.deletePermission(id);
      fetchPermissions();
    } catch (err: any) {
      setError(err.message || 'Failed to delete permission');
    }
  };

  const handleOpenAssign = async (user: User) => {
    setAssignTargetUser(user);
    setAssignOpen(true);
    setAssignLoading(true);
    try {
      const perms = await apiService.getUserPermissions(user.id);
      setUserPermissions(Array.isArray(perms) ? perms : []);
    } catch {
      setUserPermissions([]);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignToggle = async (permissionId: string, assign: boolean) => {
    if (!assignTargetUser) return;
    try {
      if (assign) {
        await apiService.assignPermissions(assignTargetUser.id, [{ permissionId }]);
      } else {
        await apiService.removeUserPermission(assignTargetUser.id, permissionId);
      }
      const perms = await apiService.getUserPermissions(assignTargetUser.id);
      setUserPermissions(Array.isArray(perms) ? perms : []);
    } catch (err: any) {
      setError(err.message || 'Failed to update permission');
    }
  };

  const getRoleChipColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error';
      case 'ADMIN': return 'warning';
      case 'AGENT_COLLECTION':
      case 'AGENT_STORE': return 'info';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'ADMIN': return 'Admin';
      case 'AGENT_COLLECTION': return 'Collection Agent';
      case 'AGENT_STORE': return 'Store Agent';
      case 'FARMER': return 'Farmer';
      default: return role;
    }
  };

  const adminUsers = users.filter((u) => ['ADMIN', 'SUPER_ADMIN', 'AGENT_COLLECTION', 'AGENT_STORE'].includes(u.role ?? ''));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" /> User & Permission Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create admin/agent accounts, manage permissions, and control access attributes.
          </Typography>
        </Box>
        <Can permission="admin.users.create">
          <Button variant="contained" startIcon={<PersonAdd />} onClick={() => { setCreateResult(null); setCreateOpen(true); }}
            sx={{ borderRadius: 3, fontWeight: 'bold' }}>
            Add New User
          </Button>
        </Can>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab icon={<AdminPanelSettings />} label="Users" iconPosition="start" />
        <Tab icon={<Shield />} label="Permission Attributes" iconPosition="start" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                          No admin or agent users found. Create one using "Add New User".
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {adminUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{user.username}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={getRoleLabel(user.role ?? '')} size="small"
                          color={getRoleChipColor(user.role ?? '') as any}
                          variant="outlined" sx={{ fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.verification_status === 'VERIFIED' ? 'Active' : 'Pending'}
                          size="small"
                          color={user.verification_status === 'VERIFIED' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Can permission="admin.users.permissions">
                          <Button size="small" variant="text"
                            startIcon={<Shield fontSize="small" />}
                            onClick={() => handleOpenAssign(user)}>
                            Permissions
                          </Button>
                        </Can>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {tabValue === 1 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Custom Permission Attributes
            </Typography>
            <Can permission="permissions.attributes.create">
              <Button variant="outlined" startIcon={<Add />} onClick={() => setNewPermOpen(true)}
                sx={{ borderRadius: 3 }}>
                New Attribute
              </Button>
            </Can>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Define custom permission attributes (ABAC). These are enforced at both API and UI level.
          </Typography>

          {permLoading ? (
            <CircularProgress />
          ) : permissions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No permission attributes defined yet. Create your first one.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {permissions.map((perm) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={perm.id}>
                  <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">{perm.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Key: <code>{perm.key}</code>
                          </Typography>
                          {perm.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {perm.description}
                            </Typography>
                          )}
                        </Box>
                        <Can permission="permissions.attributes.delete">
                          <IconButton size="small" color="error" onClick={() => handleDeletePermission(perm.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Can>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={() => { if (!createLoading) { setCreateOpen(false); setCreateResult(null); } }}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.3rem' }}>
          {createResult ? 'User Created Successfully' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {createResult ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert severity="success" sx={{ borderRadius: 3 }}>
                User <strong>{createResult.user.firstName} {createResult.user.lastName}</strong> ({createResult.user.role}) has been created.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Share this activation link with the user:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8f9fa', wordBreak: 'break-all' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {createResult.activationLink}
                  </Typography>
                  <IconButton size="small" onClick={() => { navigator.clipboard.writeText(createResult.activationLink); }}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                This link expires in 7 days. The user will set their own password during activation.
              </Alert>
            </Stack>
          ) : (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField label="First Name" fullWidth required value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField label="Last Name" fullWidth required value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField label="Email Address" fullWidth required type="email" value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField select label="User Role" fullWidth value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="AGENT_STORE">Store Agent</MenuItem>
                <MenuItem value="AGENT_COLLECTION">Collection Agent</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {createResult ? (
            <Button onClick={() => { setCreateOpen(false); setCreateResult(null); }}
              variant="contained" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
              Done
            </Button>
          ) : (
            <>
              <Button onClick={() => setCreateOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
              <Button onClick={handleCreateUser} variant="contained"
                disabled={createLoading || !createForm.firstName || !createForm.lastName || !createForm.email}
                sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}>
                {createLoading ? <CircularProgress size={20} color="inherit" /> : 'Create User'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* New Permission Dialog with Autocomplete */}
      <Dialog open={newPermOpen} onClose={() => setNewPermOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>New Permission Attribute</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={permKeyOptions}
              getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.key} — ${option.name}`)}
              inputValue={permKeySearch}
              onInputChange={(_, value) => {
                setNewPermForm({ ...newPermForm, key: value, name: value });
                handlePermKeySearch(value);
              }}
              onChange={(_, value) => {
                if (value && typeof value !== 'string') {
                  setNewPermForm({ key: value.key, name: value.name, description: '' });
                  setPermKeySearch(`${value.key} — ${value.name}`);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Permission Key" fullWidth required
                  placeholder="Search or type a new key..."
                  helperText="Select from known system keys or type a custom one"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
            />
            <TextField label="Display Name" fullWidth required value={newPermForm.name}
              onChange={(e) => setNewPermForm({ ...newPermForm, name: e.target.value })}
              placeholder="e.g. Access Admin Panel"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField label="Description" fullWidth multiline rows={2} value={newPermForm.description}
              onChange={(e) => setNewPermForm({ ...newPermForm, description: e.target.value })}
              placeholder="Optional description of what this permission grants"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setNewPermOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button onClick={handleCreatePermission} variant="contained"
            disabled={!newPermForm.key || !newPermForm.name}
            sx={{ borderRadius: 3, fontWeight: 'bold' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Permissions Dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.3rem' }}>
          Permissions — {assignTargetUser?.first_name} {assignTargetUser?.last_name}
        </DialogTitle>
        <DialogContent>
          {assignLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : permissions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No permission attributes defined. Go to "Permission Attributes" tab to create some.
            </Typography>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {permissions.map((perm) => {
                const isAssigned = userPermissions.some((up) => up.permission_id === perm.id);
                return (
                  <Paper key={perm.id} variant="outlined"
                    sx={{
                      p: 2, borderRadius: 3,
                      borderColor: isAssigned ? 'success.main' : 'divider',
                      bgcolor: isAssigned ? 'rgba(76,175,80,0.04)' : 'transparent',
                    }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CheckCircle color={isAssigned ? 'success' : 'disabled'} fontSize="small" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="bold">{perm.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          <code>{perm.key}</code>
                          {perm.description ? ` — ${perm.description}` : ''}
                        </Typography>
                      </Box>
                      <Can permission="admin.users.permissions">
                        <Button
                          size="small"
                          variant={isAssigned ? 'outlined' : 'contained'}
                          color={isAssigned ? 'error' : 'primary'}
                          onClick={() => handleAssignToggle(perm.id, !isAssigned)}
                          sx={{ borderRadius: 2, minWidth: 80 }}
                        >
                          {isAssigned ? 'Remove' : 'Assign'}
                        </Button>
                      </Can>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAssignOpen(false)} variant="contained" sx={{ borderRadius: 3, fontWeight: 'bold' }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
