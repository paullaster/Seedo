'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  Button,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Phone,
  LocationOn,
  Launch,
  Agriculture,
  Badge,
  Schedule,
} from '@mui/icons-material';
import { Agent } from '@/app/lib/types';

interface AgentDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  agent: Agent | null;
}

const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({ open, onClose, agent }) => {
  if (!agent) return null;

  const maskId = (id?: string) => {
    if (!id) return 'N/A';
    return `${id.slice(0, 3)}****${id.slice(-2)}`;
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '95vh',
          height: 'auto',
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.05)' }}
        >
          <Close />
        </IconButton>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
          <Avatar
            src={agent.avatarUrl}
            sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {agent.name[0]}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {agent.name}
            {agent.isVerified && <CheckCircle color="success" sx={{ ml: 1, verticalAlign: 'middle' }} />}
          </Typography>
          <Chip
            label={agent.agentType === 'STORE' ? 'Physical Intake Hub' : 'Mobile Collection Partner'}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Verification Details */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 4, mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge fontSize="small" /> Verification Info
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">National ID</Typography>
              <Typography variant="body2" fontWeight="bold">{maskId(agent.nationalId)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Store Certification</Typography>
              <Typography variant="body2" fontWeight="bold">{agent.storeId || 'Individual'}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Rates & Produce */}
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Agriculture color="primary" /> Accepted Produce & Daily Rates
        </Typography>
        <Stack spacing={2} sx={{ mb: 4 }}>
          {agent.acceptedProduce?.map((p) => (
            <Paper key={p} elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold">{p}</Typography>
                <Typography variant="caption" color="text.secondary">Grade A / Grade B</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">KES 45.50</Typography>
                <Typography variant="caption">per KG</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Location */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" /> Location Details
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{agent.location.address}</Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Launch />}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${agent.location.lat},${agent.location.lng}`, '_blank')}
            sx={{ py: 2, borderRadius: 4, fontWeight: 'bold' }}
          >
            Take me there
          </Button>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ pb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Phone />}
            onClick={() => window.location.href = `tel:${agent.phone}`}
            sx={{ py: 2, borderRadius: 4, fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Call Agent
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Schedule />}
            sx={{ py: 2, borderRadius: 4, fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            Inquire
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default AgentDetailDrawer;
