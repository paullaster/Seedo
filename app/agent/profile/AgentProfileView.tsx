'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, Alert, Snackbar, Divider, Paper, Stack, Button } from '@mui/material';
import StoreCredentialCard from './components/StoreCredentialCard';
import SecuritySection from '@/app/farmer/profile/components/SecuritySection';
import OTPDrawer from '@/app/farmer/profile/components/OTPDrawer';
import { Verified, Store, Lock } from '@mui/icons-material';
import type { AgentProfile } from '@/app/lib/types';

export default function AgentProfileView({
  initialProfile,
}: {
  initialProfile: AgentProfile;
}) {
  const [profile, setProfile] = useState<AgentProfile>(initialProfile);
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [activeField, setActiveField] = useState<'email' | 'phone' | 'nationalId' | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleEditField = (field: 'email' | 'phone' | 'nationalId') => {
    setActiveField(field);
    setIsOTPOpen(true);
  };

  const handleVerifyOTP = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: activeField, code }),
      });

      if (!res.ok) {
        if (code === '000000') return false;
        throw new Error('Verification failed');
      }

      if (activeField === 'email' || activeField === 'phone') {
        setProfile((prev) => ({
          ...prev,
          verificationStatus: {
            ...prev.verificationStatus,
            [activeField]: 'verified',
          },
        }));

        setNotification({
          show: true,
          message: `${activeField.charAt(0).toUpperCase() + activeField.slice(1)} verified successfully!`,
          type: 'success',
        });
      }

      return true;
    } catch {
      setNotification({
        show: true,
        message: 'Verification failed. Please try again.',
        type: 'error',
      });
      return false;
    }
  };

  const getFieldLabel = (field: string | null) => {
    switch (field) {
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      default: return '';
    }
  };

  const getTargetValue = (field: string | null) => {
    switch (field) {
      case 'email': return profile.email;
      case 'phone': return profile.phone;
      default: return '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Agent Identity & Security
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your certified credentials and dual-channel verification settings.
        </Typography>
      </Box>

      {(!profile.isVetted) && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
          Your account is currently <strong>Pending Vetting</strong>. Full payout features will be enabled once an admin verifies your store credentials.
        </Alert>
      )}

      <StoreCredentialCard profile={profile} />

      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 6 }}>
        <Lock color="primary" /> Security Center
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        AgriCollect requires separate verification for both phone and email to ensure maximum security for high-value transactions.
      </Typography>

      <SecuritySection
        email={profile.email}
        phone={profile.phone}
        nationalId=""
        verificationStatus={{
          email: profile.verificationStatus.email,
          phone: profile.verificationStatus.phone,
          nationalId: 'verified',
        }}
        onEditField={handleEditField}
      />

      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#f5f5f5', mt: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Store color="action" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">Store Assignment</Typography>
            <Typography variant="body2" color="text.secondary">You are currently assigned to <strong>{profile.region} Hub</strong>.</Typography>
          </Box>
          <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Request Transfer</Button>
        </Stack>
      </Paper>

      <OTPDrawer
        open={isOTPOpen}
        onClose={() => setIsOTPOpen(false)}
        onVerify={handleVerifyOTP}
        fieldLabel={getFieldLabel(activeField)}
        targetValue={getTargetValue(activeField)}
      />

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.type} variant="filled" sx={{ borderRadius: 2 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
