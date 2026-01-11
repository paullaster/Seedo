'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  Chip, 
  IconButton, 
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { MOCK_FARMERS, MOCK_AGENTS } from '@/app/lib/mock-data';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';

const MotionTableRow = motion(TableRow);

export default function UserManagementPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [farmers, setFarmers] = useState(MOCK_FARMERS);
  const [agents, setAgents] = useState(MOCK_AGENTS);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tabValue === 0) {
      setFarmers(farmers.filter(f => f.id !== userToDelete.id));
    } else {
      setAgents(agents.filter(a => a.id !== userToDelete.id));
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Filter Logic
  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.nationalId.includes(searchQuery)
  );

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight="900" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system access for Farmers and Collection Agents.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add New {tabValue === 0 ? 'Farmer' : 'Agent'}
        </Button>
      </Box>

      {/* Tabs & Search */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" mb={4}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            sx={{ bgcolor: 'background.paper' }}
          >
            <Tab label="Farmers" sx={{ px: 4, fontWeight: 'bold' }} />
            <Tab label="Agents" sx={{ px: 4, fontWeight: 'bold' }} />
          </Tabs>
        </Paper>
        
        <TextField
          placeholder="Search by Name or ID..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
      </Stack>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location / Region</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 0 ? filteredFarmers : filteredAgents).map((user) => (
              <MotionTableRow 
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: tabValue === 0 ? theme.palette.primary.main : theme.palette.secondary.main, color: '#000', fontWeight: 'bold' }}>
                      {user.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tabValue === 0 ? (user as any).nationalId : 'Agent ID: ' + user.id}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.phone}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </TableCell>
                <TableCell>
                  {tabValue === 0 ? (
                    <Typography variant="body2">{(user as any).location.address}</Typography>
                  ) : (
                    <Chip label={(user as any).region} size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                   {tabValue === 1 ? (
                     <Chip 
                       label={(user as any).active ? 'Active' : 'Inactive'} 
                       color={(user as any).active ? 'success' : 'default'} 
                       size="small" 
                     />
                   ) : (
                     <Chip label="Verified" color="success" size="small" />
                   )}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="warning"><BlockIcon fontSize="small" /></IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </MotionTableRow>
            ))}
            
            {(tabValue === 0 ? filteredFarmers : filteredAgents).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">No users found matching your search.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4, p: 2, border: `1px solid ${theme.palette.error.main}` }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{userToDelete?.name}</strong> from the system?
            This action cannot be undone and will affect historical records.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
