'use client';
import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  InputAdornment, IconButton, Alert, Stepper, Step, StepLabel, 
  Stack, MenuItem, CircularProgress
} from '@mui/material';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getGeoLocation, reverseGeocode } from '@/app/lib/geo-utils';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

const steps = ['Identity', 'Farm Details', 'Security'];

export default function RegisterPage() {
  const { registerFarmer } = useAuth();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    produceType: [] as string[],
    password: '',
    confirmPassword: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    }
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

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

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerFarmer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nationalId: formData.nationalId,
        password: formData.password,
        produceType: formData.produceType,
        location: formData.location
      });
      router.push('/farmer');
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField 
              label="Full Name" 
              fullWidth required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextField 
              label="Email Address" 
              type="email" 
              fullWidth required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField 
              label="Phone Number" 
              type="tel" 
              fullWidth required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <TextField 
              label="National ID / Passport" 
              fullWidth required 
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              select
              label="Primary Produce"
              fullWidth required
              value={formData.produceType[0] || ''}
              onChange={(e) => setFormData({...formData, produceType: [e.target.value]})}
            >
              <MenuItem value="Maize">Maize</MenuItem>
              <MenuItem value="Wheat">Wheat</MenuItem>
              <MenuItem value="Beans">Beans</MenuItem>
              <MenuItem value="Coffee">Coffee</MenuItem>
            </TextField>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Farm Location *</Typography>
              <Typography variant="caption" color="text.secondary" paragraph>
                We need your GPS coordinates to find nearest agents.
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(255,255,255,0.02)' }}>
                <Box>
                  {formData.location.address ? (
                    <>
                      <Typography variant="body2" fontWeight="bold" color="success.main">Location Captured</Typography>
                      <Typography variant="caption">{formData.location.address}</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No location set</Typography>
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
      case 2:
        return (
          <Stack spacing={2}>
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
            <Alert severity="info" sx={{ mt: 2 }}>
              By registering, you agree to our Terms of Service for AgriCollect.
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
          Farmer Registration
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ minHeight: 300 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.password}
              size="large"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!formData.name || !formData.email)) ||
                (activeStep === 1 && (!formData.produceType.length || !formData.location.address))
              }
            >
              Next Step
            </Button>
          )}
        </Box>

        <Box textAlign="center" mt={3}>
           <Link href="/auth/login" style={{ textDecoration: 'none', color: 'inherit' }}>
             <Typography variant="caption" sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
               Already have an account? Login
             </Typography>
           </Link>
        </Box>
      </Paper>
    </Container>
  );
}
