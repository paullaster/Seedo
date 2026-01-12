'use client';
import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  Alert, Link as MuiLink, Divider, Stack 
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/app/lib/api-service';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'IDENTITY' | 'OTP'>('IDENTITY');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiService.sendOTP(identity);
      if (res.success) {
        setStep('OTP');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        identity,
        code: otpCode,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid OTP code. Please check and try again.');
      } else {
        router.push('/farmer');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/farmer' });
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h4" fontWeight="900" gutterBottom align="center" color="primary">
          AgriCollect
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={4}>
          {step === 'IDENTITY' ? 'Farmer Secure Login' : 'Enter Verification Code'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {step === 'IDENTITY' ? (
          <Box component="form" onSubmit={handleRequestOTP}>
            <TextField
              label="Email or Phone Number"
              fullWidth
              required
              margin="normal"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="e.g. 0712345678 or farmer@example.com"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ mt: 3, mb: 2, height: 50 }}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Get Login Code'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyOTP}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              We sent a 6-digit code to <strong>{identity}</strong>
            </Typography>
            <TextField
              label="Verification Code"
              fullWidth
              required
              margin="normal"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '24px' } }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ mt: 3, mb: 2, height: 50 }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <Button 
              variant="text" 
              fullWidth 
              onClick={() => setStep('IDENTITY')}
              disabled={loading}
            >
              Change Email/Phone
            </Button>
          </Box>
        )}

        <Box sx={{ my: 3 }}>
          <Divider>
            <Typography variant="body2" color="text.secondary">OR</Typography>
          </Divider>
        </Box>

        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ height: 50, borderColor: 'rgba(255,255,255,0.2)', color: 'text.primary' }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              New to AgriCollect?{' '}
              <Link href="/auth/register" passHref legacyBehavior>
                <MuiLink color="secondary" fontWeight="bold">Create Farmer Account</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}