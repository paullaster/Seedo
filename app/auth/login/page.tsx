'use client';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, InputAdornment, IconButton, Alert, Link as MuiLink } from '@mui/material';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(identity, password);
      if (success) {
        // Redirect based on role (simple check for now, ideally context handles this)
        // For prototype, we assume farmer login mostly
        router.push('/farmer'); 
      } else {
        setError('Invalid credentials. Try "elias.m@seedo.ag" / "password"');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 4, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h4" fontWeight="900" gutterBottom align="center" color="primary">
          AgriCollect
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={4}>
          Farmer Secure Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email or Phone Number"
            fullWidth
            required
            margin="normal"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            sx={{ mt: 4, mb: 2, height: 50 }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </Button>
          
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              New to AgriCollect?{' '}
              <Link href="/auth/register" passHref legacyBehavior>
                <MuiLink color="secondary" fontWeight="bold">Create Farmer Account</MuiLink>
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
