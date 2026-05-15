'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  Alert, Stepper, Step, StepLabel, 
  Stack, CircularProgress, Divider, Autocomplete
} from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/app/lib/api-service';
import { getGeoLocation, reverseGeocode } from '@/app/lib/geo-utils';
import type { MarketRate } from '@/app/lib/types';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

const steps = ['Identity', 'Verification', 'Farm Details', 'Complete'];

export default function RegisterPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [produceOptions, setProduceOptions] = useState<MarketRate[]>([]);
  const [produceSearchLoading, setProduceSearchLoading] = useState(false);
  const [produceInput, setProduceInput] = useState('');
  const [selectedProduce, setSelectedProduce] = useState<MarketRate | null>(null);
  const produceSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    otp: '',
    produceType: [] as string[],
    password: '',
    confirmPassword: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    provider: 'custom' as 'google' | 'custom'
  });

  // Effect to pre-fill if Google user
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
        provider: (session.user as any).provider || 'google'
      }));
    }
  }, [session]);

  const handleNext = async () => {
    setError('');
    
    // Step 0: Identity (Send OTP to Phone for ALL users)
    if (activeStep === 0) {
      if (!formData.phone) {
        setError('Please provide a phone number for verification.');
        return;
      }

      setLoading(true);
      try {
        // We now verify Phone for everyone as it's used for payments
        const res = await apiService.sendOTP(formData.phone);
        if (res.success) {
          setOtpSent(true);
          setActiveStep(1);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to send verification code.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 1: Verification (Verify OTP for Phone)
    if (activeStep === 1) {
      setLoading(true);
      try {
        const isValid = await apiService.verifyOTP(formData.phone, formData.otp);
        if (isValid) {
          setActiveStep(2);
        } else {
          setError('Invalid verification code.');
        }
      } catch (err) {
        setError('Verification failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = async () => {
    if (activeStep === 0) {
      if (session?.user) {
        // If Google user cancels, sign them out (clear session) and go home
        await signOut({ callbackUrl: '/' });
      } else {
        router.push('/');
      }
      return;
    }
    setActiveStep((prev) => prev - 1);
  };

  const handleGeoCapture = async () => {
    setGeoLoading(true);
    setError('');
    try {
      const coords = await getGeoLocation();
      const addressData = await reverseGeocode(coords.lat, coords.lng);
      
      setFormData(prev => ({
        ...prev,
        location: {
          lat: coords.lat,
          lng: coords.lng,
          address: addressData.address
        }
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to get location.');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleProduceSearch = (query: string) => {
    if (produceSearchRef.current) clearTimeout(produceSearchRef.current);
    if (!query.trim()) {
      setProduceOptions([]);
      return;
    }
    produceSearchRef.current = setTimeout(async () => {
      setProduceSearchLoading(true);
      try {
        const results = await apiService.searchProduce(query);
        setProduceOptions(results);
      } catch {
        setProduceOptions([]);
      } finally {
        setProduceSearchLoading(false);
      }
    }, 300);
  };

  const handleSubmit = async () => {
    const isGoogle = formData.provider === 'google';
    if (!isGoogle) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setLoading(true);
    try {
      await apiService.registerFarmer({
        ...formData,
        nationalId: formData.nationalId,
        authProvider: isGoogle ? 'google' : 'custom',
      });
      
      if (isGoogle) {
        await updateSession({ isComplete: true, role: 'FARMER' });
        router.push('/farmer');
      } else {
        await signIn('credentials', {
          identity: formData.phone,
          password: formData.password,
          callbackUrl: '/farmer',
        });
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Identity
        return (
          <Stack spacing={2}>
            {!session?.user && (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={() => signIn('google')}
                  sx={{ height: 50, mb: 2 }}
                >
                  Sign up with Google
                </Button>
                <Divider><Typography variant="body2" color="text.secondary">OR</Typography></Divider>
              </>
            )}
            
            <TextField 
              label="Full Name" 
              fullWidth required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={formData.provider === 'google'} 
            />
            <TextField 
              label="Email Address" 
              type="email"
              fullWidth required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={formData.provider === 'google'} 
            />
            <TextField 
              label="Phone Number" 
              type="tel"
              fullWidth required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="e.g. +2547..."
              helperText="Mandatory: This will be used for M-Pesa payments"
            />
          </Stack>
        );
      case 1: // Verification (OTP)
        return (
          <Stack spacing={2} textAlign="center">
            <Typography variant="body1">
              Verify your Phone Number
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We sent a code to {formData.phone}
            </Typography>
            <TextField 
              label="6-Digit Code" 
              fullWidth required 
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              slotProps={{
                htmlInput: {maxLength: 6, style: {textAlign: 'center', letterSpacing: '8px', fontSize: '24px' } }
              }}
            />
            <Button size="small" onClick={() => setActiveStep(0)}>Change Phone Number</Button>
          </Stack>
        );
      case 2: // Farm Details
        return (
          <Stack spacing={3}>
            <TextField 
              label="National ID / Passport" 
              fullWidth required 
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
            />
            <Autocomplete
              options={produceOptions}
              getOptionLabel={(option) => option.produceType}
              inputValue={produceInput}
              onInputChange={(_, value) => {
                setProduceInput(value);
                handleProduceSearch(value);
              }}
              value={selectedProduce}
              onChange={(_, value) => {
                setSelectedProduce(value);
                setFormData({...formData, produceType: value ? [value.produceType] : []});
                setProduceInput(value ? value.produceType : '');
              }}
              loading={produceSearchLoading}
              noOptionsText={produceInput.length >= 2 ? 'No produce found' : 'Type to search...'}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Primary Produce"
                  required
                  placeholder="Search produce..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              )}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Farm Location *</Typography>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Box>
                  {formData.location.address ? (
                    <>
                      <Typography variant="body2" fontWeight="bold" color="success.main">Location Captured</Typography>
                      <Typography variant="caption">{formData.location.address}</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">GPS Coordinates Required</Typography>
                  )}
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={geoLoading ? <CircularProgress size={16} /> : <MyLocationIcon />}
                  onClick={handleGeoCapture}
                  disabled={geoLoading}
                >
                  {formData.location.address ? 'Update' : 'Locate Me'}
                </Button>
              </Paper>
            </Box>
          </Stack>
        );
      case 3: // Complete (Security for Custom)
        return (
          <Stack spacing={2}>
            {formData.provider === 'custom' ? (
              <>
                <Typography variant="body2" color="text.secondary" mb={1}>Set your account password</Typography>
                <TextField 
                  label="Password" 
                  type="password" 
                  fullWidth required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <TextField 
                  label="Confirm Password" 
                  type="password" 
                  fullWidth required 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="primary" gutterBottom>Profile Ready!</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your Google account is now linked with your farm details and verified phone.
                </Typography>
              </Box>
            )}
            <Alert severity="info" sx={{ mt: 2 }}>
              By completing registration, you agree to AgriCollect Terms of Service.
            </Alert>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" fontWeight="900" gutterBottom align="center">
          {session?.user ? 'Complete Your Profile' : 'Farmer Registration'}
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ minHeight: 320 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || (formData.provider === 'custom' && !formData.password)}
              size="large"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                loading ||
                (activeStep === 0 && (!formData.name || !formData.email || !formData.phone)) ||
                (activeStep === 1 && formData.otp.length < 6) ||
                (activeStep === 2 && (!formData.nationalId || !formData.produceType.length || !formData.location.address))
              }
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Next Step'}
            </Button>
          )}
        </Box>

        {!session?.user && (
          <Box textAlign="center" mt={3}>
             <Link href="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>
               <Typography variant="caption" sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                 Already have an account? Login
               </Typography>
             </Link>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
