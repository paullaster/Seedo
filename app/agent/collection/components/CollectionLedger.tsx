'use client';

import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Button,
  Stack,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  HistoryEdu,
  Block,
  CheckCircle,
  PendingActions,
  LocalShipping,
} from '@mui/icons-material';
import { ProduceCollection, CollectionStatus } from '@/app/lib/types';
import { motion } from 'framer-motion';

interface CollectionLedgerProps {
  collections: ProduceCollection[];
  onVerifyBatch: (ids: string[]) => void;
  onDispute: (id: string, reason: string) => void;
  agentType: 'STORE' | 'COLLECTION';
}

const CollectionLedger: React.FC<CollectionLedgerProps> = ({
  collections,
  onVerifyBatch,
  onDispute,
  agentType,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(collections.filter(c => c.status === 'PENDING').map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusChip = (status: CollectionStatus) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" size="small" icon={<PendingActions />} sx={{ bgcolor: '#fff3e0', color: '#ef6c00' }} />;
      case 'VERIFIED':
        return <Chip label="Verified" size="small" icon={<CheckCircle />} sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />;
      case 'IN_TRANSIT':
        return <Chip label="In-Transit" size="small" icon={<LocalShipping />} sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />;
      case 'DISPUTED':
        return <Chip label="Disputed" size="small" icon={<Block />} color="error" variant="outlined" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const filteredCollections = collections.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.produceType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} justifyContent="space-between" alignItems="center">
        <TextField
          placeholder="Search by ID or Produce..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        
        <Stack direction="row" spacing={1}>
          <Button startIcon={<FilterList />} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
            Filters
          </Button>
          {agentType === 'COLLECTION' && selected.length > 0 && (
            <Button
              variant="contained"
              startIcon={<HistoryEdu />}
              onClick={() => onVerifyBatch(selected)}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Verify Selected ({selected.length})
            </Button>
          )}
        </Stack>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              {agentType === 'COLLECTION' && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < collections.filter(c => c.status === 'PENDING').length}
                    checked={collections.length > 0 && selected.length === collections.filter(c => c.status === 'PENDING').length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 'bold' }}>Batch ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Farmer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Produce</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCollections.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {agentType === 'COLLECTION' && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      disabled={row.status !== 'PENDING'}
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">{row.id}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(row.timestamp).toLocaleDateString()}</Typography>
                </TableCell>
                <TableCell>Farmer ID: {row.farmerId}</TableCell>
                <TableCell>{row.produceType}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.weightKg} KG</TableCell>
                <TableCell>
                  <Chip label={row.grade} size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                </TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Details">
                      <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                    </Tooltip>
                    {agentType === 'COLLECTION' && row.status === 'PENDING' && (
                      <>
                        <Tooltip title="Dispute Batch">
                          <IconButton size="small" color="error" onClick={() => onDispute(row.id, 'Mismatch detected')}>
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CollectionLedger;
