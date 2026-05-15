'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, Alert, Snackbar } from '@mui/material';
import GrowthMetaphor from './components/GrowthMetaphor';
import SecuritySection from './components/SecuritySection';
import IdentityPersonalization from './components/IdentityPersonalization';
import SmartLocation from './components/SmartLocation';
import OTPDrawer from './components/OTPDrawer';
import type { FarmerProfile } from '@/app/lib/types';

export default function FarmerProfileView({
  initialProfile,
}: {
  initialProfile: FarmerProfile;
}) {
  const [profile, setProfile] = useState<FarmerProfile>(initialProfile);
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

      if (activeField) {
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

  const handleUpdateIdentity = (data: { farmName: string; crops: string[] }) => {
    setProfile((prev) => ({
      ...prev,
      farmName: data.farmName,
      produceType: data.crops,
    }));

    setNotification({
      show: true,
      message: 'Profile updated successfully!',
      type: 'success',
    });
  };

  const handleUpdateLocation = (location: { lat: number; lng: number; address: string }) => {
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        ...location,
      },
    }));

    setNotification({
      show: true,
      message: 'Location updated successfully!',
      type: 'success',
    });
  };

  const getFieldLabel = (field: string | null) => {
    switch (field) {
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      case 'nationalId': return 'National ID';
      default: return '';
    }
  };

  const getTargetValue = (field: string | null) => {
    switch (field) {
      case 'email': return profile.email;
      case 'phone': return profile.phone;
      case 'nationalId': return profile.nationalId;
      default: return '';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Profile & Identity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your digital farm identity, secure your account, and personalize your experience.
        </Typography>
      </Box>

      {profile.verificationStatus.email === 'pending' && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Your email is not verified. Verify it now to receive important payment notifications.
        </Alert>
      )}

      <GrowthMetaphor percentage={profile.completionPercentage} />

      <IdentityPersonalization
        initialFarmName={profile.farmName || ''}
        initialCrops={profile.produceType || []}
        avatarUrl={profile.avatarUrl}
        onUpdate={handleUpdateIdentity}
      />

      <SecuritySection
        email={profile.email}
        phone={profile.phone}
        nationalId={profile.nationalId}
        verificationStatus={profile.verificationStatus}
        onEditField={handleEditField}
      />

      <SmartLocation
        initialLocation={{
          lat: profile.location.lat,
          lng: profile.location.lng,
          address: profile.location.address,
        }}
        onUpdate={handleUpdateLocation}
      />

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
        <Alert
          onClose={() => setNotification({ ...notification, show: false })}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
