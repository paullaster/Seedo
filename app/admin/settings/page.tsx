'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Slider,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Settings,
  NotificationsActive,
  Security,
  AccountBalance,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function SystemSettings() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/admin')} sx={{ mb: 1 }}>
            Dashboard
          </Button>
          <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
            System Configuration
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            Regulate global guardrails, financial logic, and security protocols.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Save />} 
          onClick={handleSave}
          sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          Save Changes
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>System configuration updated successfully!</Alert>}

      <Grid container spacing={4}>
        {/* 1. Financial Guardrails */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee', height: '100%' }}>
            <Typography variant="h5" fontWeight="900" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountBalance color="primary" /> Financial Guardrails
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Loan Recovery Cap (Living Wage Rule)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Maximum percentage of a payout that can be diverted to loan recovery.
                </Typography>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Slider defaultValue={60} valueLabelDisplay="auto" sx={{ flexGrow: 1 }} />
                  <Typography variant="h6" fontWeight="900">60%</Typography>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Agent Commission Logic
                </Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Flat Fee (KES/KG)" defaultValue="1.50" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField fullWidth label="Variable % (Optional)" defaultValue="0.00" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Minimum Disbursement Threshold
                </Typography>
                <TextField 
                  fullWidth 
                  label="Amount in KES" 
                  defaultValue="500" 
                  sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} 
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* 2. Notifications & Security */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee' }}>
              <Typography variant="h5" fontWeight="900" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <NotificationsActive color="primary" /> Communication
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="Enable SMS Notifications" />
                <FormControlLabel control={<Switch defaultChecked />} label="Enable Push Notifications" />
                <FormControlLabel control={<Switch />} label="Enable Automated Email Reports" />
                <FormControlLabel control={<Switch defaultChecked />} label="Alert Admin on High Wastage (>5%)" />
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #eee' }}>
              <Typography variant="h5" fontWeight="900" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Security color="primary" /> Security & Access
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel control={<Switch defaultChecked />} label="Two-Factor for Major Payments" />
                <FormControlLabel control={<Switch defaultChecked />} label="Enforce GPS Metadata on Photos" />
                <FormControlLabel control={<Switch />} label="Maintenance Mode (Lock System)" />
              </Stack>
              <Button variant="outlined" color="error" fullWidth sx={{ mt: 3, borderRadius: 3, fontWeight: 'bold' }}>
                Revoke All Active Sessions
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
