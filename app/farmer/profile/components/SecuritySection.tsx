'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Verified,
  Pending,
  Error as ErrorIcon,
  Edit,
  Phone,
  Email,
  Badge,
} from '@mui/icons-material';
import { VerificationStatus } from '@/app/lib/types';

interface SecurityFieldProps {
  label: string;
  value: string;
  status: VerificationStatus;
  icon: React.ReactNode;
  onEdit: () => void;
  mask?: boolean;
}

const SecurityField: React.FC<SecurityFieldProps> = ({ label, value, status, icon, onEdit, mask }) => {
  const getStatusChip = (s: VerificationStatus) => {
    switch (s) {
      case 'verified':
        return (
          <Chip
            icon={<Verified sx={{ fontSize: '1rem !important' }} />}
            label="Verified"
            size="small"
            sx={{
              bgcolor: '#e8f5e9',
              color: '#2e7d32',
              fontWeight: 'bold',
              '& .MuiChip-icon': { color: '#2e7d32' },
            }}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<Pending sx={{ fontSize: '1rem !important' }} />}
            label="Pending"
            size="small"
            sx={{
              bgcolor: '#fff3e0',
              color: '#ef6c00',
              '& .MuiChip-icon': { color: '#ef6c00' },
            }}
          />
        );
      default:
        return (
          <Chip
            icon={<ErrorIcon sx={{ fontSize: '1rem !important' }} />}
            label="Unverified"
            size="small"
            sx={{
              bgcolor: '#ffebee',
              color: '#c62828',
              '& .MuiChip-icon': { color: '#c62828' },
            }}
          />
        );
    }
  };

  const maskValue = (val: string, type: string) => {
    if (!mask) return val;
    if (label.toLowerCase().includes('email')) {
      const [name, domain] = val.split('@');
      return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
    }
    if (label.toLowerCase().includes('phone')) {
      return val.replace(/(\+\d{3})\s(\d{3})\s(\d{3})\s(\d{3})/, '$1 **** $4');
    }
    return `****${val.slice(-4)}`;
  };

  return (
    <Box sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1" fontWeight="medium">
              {maskValue(value, label)}
            </Typography>
            {getStatusChip(status)}
          </Stack>
        </Box>
        <IconButton onClick={onEdit} size="small" color="primary">
          <Edit fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};

interface SecuritySectionProps {
  email: string;
  phone: string;
  nationalId: string;
  verificationStatus: {
    email: VerificationStatus;
    phone: VerificationStatus;
    nationalId: VerificationStatus;
  };
  onEditField: (field: 'email' | 'phone' | 'nationalId') => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  email,
  phone,
  nationalId,
  verificationStatus,
  onEditField,
}) => {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0', mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Verified color="primary" /> Security & Identity
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        These details are essential for processing payments and ensuring the security of your account.
      </Typography>

      <Divider />

      <SecurityField
        label="National ID"
        value={nationalId}
        status={verificationStatus.nationalId}
        icon={<Badge />}
        onEdit={() => onEditField('nationalId')}
        mask
      />
      <Divider />
      <SecurityField
        label="Phone Number"
        value={phone}
        status={verificationStatus.phone}
        icon={<Phone />}
        onEdit={() => onEditField('phone')}
        mask
      />
      <Divider />
      <SecurityField
        label="Email Address"
        value={email}
        status={verificationStatus.email}
        icon={<Email />}
        onEdit={() => onEditField('email')}
        mask
      />
    </Paper>
  );
};

export default SecuritySection;
