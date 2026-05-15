'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Container, Paper,
  Alert, Stepper, Step, StepLabel, Stack, CircularProgress,
  InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, HowToReg } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '@/app/lib/api-service';
import type { ActivationUserInfo } from '@/app/lib/types';

const steps = ['Verify Identity', 'Set Password'];

export default function ActivatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState<ActivationUserInfo | null>(null);

  const [formData, setFormData] = useState({
    nationalId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid activation link. No token provided.');
      setLoading(false);
      return;
    }

    apiService.verifyActivationToken(token)
      .then((info) => {
        setUserInfo(info);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Invalid or expired activation link.');
        setLoading(false);
      });
  }, [token]);

  const handleNext = () => {
    setError('');
    if (activeStep === 0) {
      if (!formData.nationalId.trim()) {
        setError('National ID / Form number is required.');
        return;
      }
      if (!formData.phoneNumber.trim()) {
        setError('Phone number is required.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setError('');
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.activateAccount({
        token: token!,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        nationalId: formData.nationalId,
      });
      setSuccess('Account activated successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Activation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Box textAlign="center" mb={3}>
          <HowToReg color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight="900" gutterBottom>
            Account Activation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your account setup to get started
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

        {userInfo && !success && (
          <>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 280 }}>
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={`${userInfo.firstName} ${userInfo.lastName}`}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Email Address"
                    fullWidth
                    value={userInfo.email}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="National ID / Form Number"
                    fullWidth required
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    placeholder="e.g. 12345678"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. +2547..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={3}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={`${userInfo.firstName} ${userInfo.lastName}`}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    value={userInfo.email}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText="Minimum 8 characters"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Stack>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button onClick={activeStep === 0 ? () => router.push('/auth/login') : handleBack}>
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !formData.password || !formData.confirmPassword}
                  size="large"
                  sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Activate Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!formData.nationalId || !formData.phoneNumber}
                  size="large"
                  sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}
                >
                  Next Step
                </Button>
              )}
            </Box>
          </>
        )}

        {!userInfo && !loading && !success && (
          <Box textAlign="center" py={4}>
            <Button variant="contained" onClick={() => router.push('/auth/login')} sx={{ borderRadius: 3 }}>
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
