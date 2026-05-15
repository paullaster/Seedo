'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Alert } from '@mui/material';
import { PersonAdd, Send, Email, VerifiedUser, Security } from '@mui/icons-material';

interface AgentUser {
  id: string;
  name: string;
  email: string;
  agentType: string;
  region: string;
  isVerified: boolean;
  isActive: boolean;
}

const UserManagement = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STAFF');
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setAgents(Array.isArray(data) ? data : []); })
      .catch(() => { setAgents([]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Security color="primary" /> Sovereignty & Staff Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        The "Invite-Verify" Protocol ensures all staff are digitally verified before activation.
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee', mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Invite New Staff / Agent</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Email Address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              InputProps={{ startAdornment: <Email color="action" sx={{ mr: 1 }} /> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="System Role"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            >
              <MenuItem value="STAFF">Staff Admin</MenuItem>
              <MenuItem value="STORE">Store Agent</MenuItem>
              <MenuItem value="COLLECTION">Collection Agent</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Send />}
              sx={{ height: '100%', borderRadius: 3, fontWeight: 'bold' }}
            >
              Send Invite
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Typography variant="body2" color="text.secondary">Loading staff data...</Typography>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name / Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hub/Region</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{agent.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{agent.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={agent.agentType} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                  <TableCell>{agent.region}</TableCell>
                  <TableCell>
                    <Chip
                      label={agent.isVerified ? 'Verified' : 'Pending OTP'}
                      size="small"
                      color={agent.isVerified ? 'success' : 'warning'}
                      icon={agent.isVerified ? <VerifiedUser sx={{ fontSize: '1rem !important' }} /> : undefined}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserManagement;
