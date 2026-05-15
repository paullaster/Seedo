'use client';
import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Container, Paper, 
  Alert, Link as MuiLink, Divider, Stack 
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        identity,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid identity or password. Please try again.');
      } else {
        router.push('/'); 
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <Typography variant="h4" fontWeight="900" gutterBottom align="center" color="primary" sx={{ letterSpacing: -1 }}>
          AgriCollect
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={4} sx={{ fontWeight: 500 }}>
          Secure Login Access
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
            IDENTITY
          </Typography>
          <TextField
            label="Email or Phone Number"
            fullWidth
            required
            margin="normal"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="e.g. 0712345678 or user@example.com"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            PASSWORD
          </Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 3, mb: 2, height: 56, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </Button>
        </Box>

        <Box sx={{ my: 4 }}>
          <Divider>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>External Access</Typography>
          </Divider>
        </Box>

        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ height: 56, borderRadius: 3, borderColor: 'rgba(255,255,255,0.2)', color: 'text.primary', fontWeight: 'bold' }}
          >
            Continue with Google
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Need a new account?{' '}
              <Link href="/auth/register" passHref legacyBehavior>
                <MuiLink color="secondary" fontWeight="900" sx={{ textDecoration: 'none' }}>Register Here</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
