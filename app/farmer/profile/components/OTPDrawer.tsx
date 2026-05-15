'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Stack,
  Alert,
} from '@mui/material';
import { Close, Security } from '@mui/icons-material';

interface OTPDrawerProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  fieldLabel: string;
  targetValue: string;
}

const OTP_LENGTH = 6;
const INITIAL_TIMER = 60;

const OTPDrawer: React.FC<OTPDrawerProps> = ({ open, onClose, onVerify, fieldLabel, targetValue }) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, timer]);

  useEffect(() => {
    if (open) {
      setOtp(new Array(OTP_LENGTH).fill(''));
      setTimer(INITIAL_TIMER);
      setError(null);
      // Auto-focus first field
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;

    setIsVerifying(true);
    setError(null);
    try {
      const success = await onVerify(code);
      if (success) {
        onClose();
      } else {
        setError("The code entered has expired. Let's try sending a new one.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setTimer(INITIAL_TIMER);
    setOtp(new Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // In a real app, trigger resend API here
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          p: 3,
          maxHeight: '80vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Verify {fieldLabel}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We've sent a 6-digit verification code to <strong>{targetValue}</strong>. This ensures your account remains secure.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
        {otp.map((digit, idx) => (
          <TextField
            key={idx}
            inputRef={(el) => (inputRefs.current[idx] = el)}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)}
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '12px 8px' },
              inputMode: 'numeric',
            }}
            sx={{ width: 45 }}
            variant="outlined"
          />
        ))}
      </Stack>

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={otp.join('').length !== OTP_LENGTH || isVerifying}
        onClick={handleVerify}
        startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <Security />}
        sx={{ py: 1.5, borderRadius: 2, mb: 2 }}
      >
        {isVerifying ? 'Verifying...' : 'Verify & Update'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        {timer > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Resend code in <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{timer}s</span>
          </Typography>
        ) : (
          <Button onClick={handleResend} variant="text" color="primary">
            Resend Code
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default OTPDrawer;
