'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Paper,
} from '@mui/material';
import {
  Close,
  VerifiedUser,
  HistoryEdu,
  Inventory,
  Scale,
  Warning,
} from '@mui/icons-material';
import { ProduceCollection } from '@/app/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCollections: ProduceCollection[];
  onVerify: (otp: string) => Promise<boolean>;
}

const VerificationDrawer: React.FC<VerificationDrawerProps> = ({
  open,
  onClose,
  selectedCollections,
  onVerify,
}) => {
  const [step, setStep] = useState<'review' | 'otp'>('review');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalWeight = selectedCollections.reduce((sum, c) => sum + c.weightKg, 0);
  const totalAmount = selectedCollections.reduce((sum, c) => sum + c.totalAmount, 0);
  
  const gradeBreakdown = selectedCollections.reduce((acc, c) => {
    acc[c.grade] = (acc[c.grade] || 0) + c.weightKg;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    if (open) {
      setStep('review');
      setOtp('');
      setError(null);
    }
  }, [open]);

  const handleStartSigning = () => {
    setStep('otp');
  };

  const handleFinalVerify = async () => {
    if (otp.length !== 6) return;
    
    setIsVerifying(true);
    setError(null);
    try {
      const success = await onVerify(otp);
      if (success) {
        onClose();
      } else {
        setError('Invalid OTP signature. Please check and try again.');
      }
    } catch (err) {
      setError('A network error occurred during signing.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 450 }, p: 0, borderRadius: { xs: 0, sm: '24px 0 0 24px' } },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {step === 'review' ? <Inventory color="primary" /> : <VerifiedUser color="primary" />}
            {step === 'review' ? 'Review Batch' : 'Digital Signature'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {step === 'review' ? (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  You are verifying <strong>{selectedCollections.length}</strong> collections from <strong>Store Agent Kevin Omondi</strong>.
                </Alert>

                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 4, mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Batch Summary
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Total Net Weight</Typography>
                      <Typography variant="h6" fontWeight="bold">{totalWeight.toLocaleString()} KG</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Total Value</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">KES {totalAmount.toLocaleString()}</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1, display: 'block' }}>
                    Grade Breakdown
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {['A', 'B', 'C'].map(grade => (
                      <Chip
                        key={grade}
                        label={`Grade ${grade}: ${gradeBreakdown[grade] || 0}kg`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1.5 }}
                      />
                    ))}
                  </Stack>
                </Paper>

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Collection Items
                </Typography>
                <Stack spacing={1}>
                  {selectedCollections.map(c => (
                    <Box key={c.id} sx={{ p: 1.5, border: '1px solid #eee', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="bold">{c.produceType}</Typography>
                        <Typography variant="body2">{c.weightKg}kg</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">ID: {c.id} • Grade {c.grade}</Typography>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ width: 80, height: 80, bgcolor: 'primary.main', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                    <HistoryEdu sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sign for Pickup
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    An OTP has been sent to your registered device. Enter it below to authorize the move to <strong>Verified / In-Transit</strong>.
                  </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                <TextField
                  fullWidth
                  label="6-Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  variant="outlined"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 3 },
                    '& input': { textAlign: 'center', fontSize: '1.5rem', letterSpacing: 8, fontWeight: 'bold' }
                  }}
                />

                <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: 3, display: 'flex', gap: 2 }}>
                  <Warning color="warning" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    By signing, you confirm that you have physically inspected these items and they match the recorded weights and grades.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ pt: 3 }}>
          {step === 'review' ? (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleStartSigning}
              startIcon={<HistoryEdu />}
              sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
            >
              Verify & Sign Batch
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setStep('review')}
                disabled={isVerifying}
                sx={{ py: 2, borderRadius: 3 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleFinalVerify}
                disabled={otp.length !== 6 || isVerifying}
                startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <VerifiedUser />}
                sx={{ py: 2, borderRadius: 3, fontWeight: 'bold' }}
              >
                {isVerifying ? 'Signing...' : 'Confirm Signature'}
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default VerificationDrawer;
