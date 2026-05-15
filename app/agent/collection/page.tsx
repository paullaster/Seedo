'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Receipt,
} from '@mui/icons-material';
import FarmerDiscovery from './components/FarmerDiscovery';
import IntakeForm, { IntakeData } from './components/IntakeForm';
import VisualProof from './components/VisualProof';
import { Farmer, ProduceCollection } from '@/app/lib/types';

const STEPS = ['Farmer Discovery', 'Produce Details', 'Visual Proof', 'Confirm'];

export default function CollectionPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleFarmerSelected = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setActiveStep(1);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!selectedFarmer || !intakeData) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: selectedFarmer.id,
          agentId: 'A001',
          produceType: intakeData.produceType,
          grade: intakeData.grade,
          weightKg: intakeData.weightKg,
          pricePerKg: 45,
          imageUrl: capturedImage,
          location: selectedFarmer.location,
        }),
      });

      if (!res.ok) throw new Error('Failed to create collection');

      setNotification({
        show: true,
        message: 'Collection recorded and farmer notified!',
        type: 'success',
      });
      setActiveStep(STEPS.length);
    } catch (err) {
      setNotification({
        show: true,
        message: err instanceof Error ? err.message : 'Failed to create collection',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FarmerDiscovery
            onFarmerSelected={handleFarmerSelected}
            onNewFarmer={() => setNotification({ show: true, message: 'New farmer registration flow coming soon', type: 'info' as any })}
          />
        );
      case 1:
        return (
          <IntakeForm
            farmerName={selectedFarmer?.name || ''}
            onDataChange={setIntakeData}
          />
        );
      case 2:
        return (
          <VisualProof
            onImageCaptured={setCapturedImage}
          />
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Verify & Confirm Entry
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 4, mb: 3, textAlign: 'left' }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Farmer</Typography>
                  <Typography variant="body2" fontWeight="bold">{selectedFarmer?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Produce</Typography>
                  <Typography variant="body2" fontWeight="bold">{intakeData?.produceType}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Net Weight</Typography>
                  <Typography variant="body2" fontWeight="bold">{intakeData?.weightKg} KG</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Quality Grade</Typography>
                  <Chip label={`Grade ${intakeData?.grade}`} size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Estimated Payout</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">KES {( (intakeData?.weightKg || 0) * 45).toLocaleString()}</Typography>
                </Box>
              </Stack>
            </Paper>
            <Alert severity="warning" sx={{ borderRadius: 3, textAlign: 'left' }}>
              Confirming will immediately send a digital receipt to the farmer.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Produce Intake
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Record physical handoff from farmer to store.
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === STEPS.length ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #e0e0e0' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Intake Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Digital receipt has been sent to {selectedFarmer?.name}. The collection is now awaiting auditor verification.
          </Typography>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Receipt />}
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              Print Physical Receipt
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setActiveStep(0);
                setSelectedFarmer(null);
                setIntakeData(null);
                setCapturedImage(null);
              }}
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              Start New Collection
            </Button>
          </Stack>
        </Paper>
      ) : (
        <>
          <Box sx={{ minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2 }}
            >
              Back
            </Button>
            {activeStep === STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Notify Farmer'}
              </Button>
            ) : (
              activeStep !== 0 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={ (activeStep === 1 && !intakeData?.weightKg) || (activeStep === 2 && !capturedImage) }
                  endIcon={<ArrowForward />}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Continue
                </Button>
              )
            )}
          </Box>
        </>
      )}

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
      >
        <Alert severity={notification.type} variant="filled" sx={{ borderRadius: 2 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}