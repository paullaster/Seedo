'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Autocomplete, 
  MenuItem, 
  InputAdornment, 
  Stack,
  useTheme,
  Alert,
  IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_FARMERS, MOCK_MARKET_RATES } from '@/app/lib/mock-data';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';

const steps = ['Identify Farmer', 'Produce Details', 'Verification'];

export default function CollectionPage() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    farmerId: '',
    produceType: '',
    grade: 'A',
    weight: '',
    pricePerKg: 0,
    photo: null as string | null
  });
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFarmerSelect = (event: any, newValue: any) => {
    setSelectedFarmer(newValue);
    setFormData({ ...formData, farmerId: newValue?.id || '' });
  };

  const handleProduceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value;
    // Auto-fetch price based on type from Mock Rates
    const rate = MOCK_MARKET_RATES.find(r => r.produceType === type);
    setFormData({ 
      ...formData, 
      produceType: type,
      pricePerKg: rate ? rate.pricePerKg : 0
    });
  };

  // Mock Camera Action
  const handlePhotoCapture = () => {
    // In a real app, this would trigger the camera
    setFormData({ ...formData, photo: 'mock-image-data' });
  };

  const calculateTotal = () => {
    return (parseFloat(formData.weight || '0') * formData.pricePerKg).toLocaleString();
  };

  // Step 1: Identify Farmer
  const renderStep1 = () => (
    <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Typography variant="h6" gutterBottom>Find Farmer</Typography>
      <Stack spacing={3}>
        <Autocomplete
          options={MOCK_FARMERS}
          getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
          onChange={handleFarmerSelect}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search by Name or ID" 
              variant="outlined" 
              InputProps={{
                ...params.InputProps,
                startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>
              }}
            />
          )}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
          <Typography variant="overline" color="text.secondary">OR</Typography>
        </Box>

        <Button 
          variant="outlined" 
          size="large" 
          startIcon={<QrCodeScannerIcon />}
          sx={{ height: 60, borderStyle: 'dashed' }}
        >
          Scan Farmer QR Code
        </Button>

        {selectedFarmer && (
          <Card variant="outlined" sx={{ bgcolor: `${theme.palette.primary.main}10`, borderColor: theme.palette.primary.main }}>
            <CardContent>
              <Typography variant="subtitle2" color="primary.main">Selected Farmer</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedFarmer.name}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedFarmer.location.address}</Typography>
              <Typography variant="caption" display="block" mt={1}>Phone: {selectedFarmer.phone}</Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );

  // Step 2: Produce Details
  const renderStep2 = () => (
    <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Typography variant="h6" gutterBottom>Collection Details</Typography>
      <Stack spacing={3}>
        <TextField
          select
          label="Produce Type"
          value={formData.produceType}
          onChange={handleProduceChange}
          helperText={`Current Rate: KES ${formData.pricePerKg}/kg`}
        >
          {MOCK_MARKET_RATES.map((rate) => (
            <MenuItem key={rate.id} value={rate.produceType}>
              {rate.produceType}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Quality Grade"
          value={formData.grade}
          onChange={(e) => setFormData({...formData, grade: e.target.value})}
        >
          <MenuItem value="A">Grade A (Premium)</MenuItem>
          <MenuItem value="B">Grade B (Standard)</MenuItem>
          <MenuItem value="C">Grade C (Low)</MenuItem>
        </TextField>

        <TextField
          label="Weight (kg)"
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({...formData, weight: e.target.value})}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />

        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">ESTIMATED PAYOUT</Typography>
          <Typography variant="h4" color="primary.main" fontWeight="900">
            KES {calculateTotal()}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );

  // Step 3: Verification
  const renderStep3 = () => (
    <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Typography variant="h6" gutterBottom>Visual Verification</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please capture a photo of the produce on the weighing scale for audit purposes.
      </Typography>

      <Box 
        onClick={handlePhotoCapture}
        sx={{ 
          height: 200, 
          bgcolor: formData.photo ? 'transparent' : 'rgba(0,0,0,0.2)', 
          border: `2px dashed ${theme.palette.text.secondary}`,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
          mb: 3,
          position: 'relative'
        }}
      >
        {formData.photo ? (
           <Box sx={{ width: '100%', height: '100%', bgcolor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />
             <Typography variant="h6" sx={{ ml: 2 }}>Photo Captured</Typography>
           </Box>
        ) : (
          <>
            <CameraAltIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="button" color="text.secondary">Tap to Capture</Typography>
          </>
        )}
      </Box>

      {formData.photo && (
        <Alert severity="info" sx={{ mb: 2 }}>
          GPS Location & Timestamp will be embedded in this transaction.
        </Alert>
      )}
    </Box>
  );

  return (
    <Box maxWidth="md" mx="auto">
       <Typography variant="h4" fontWeight="900" gutterBottom mb={4}>
          New Collection
        </Typography>

      <Card sx={{ overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <AnimatePresence mode="wait">
            {activeStep === 0 && renderStep1()}
            {activeStep === 1 && renderStep2()}
            {activeStep === 2 && renderStep3()}
          </AnimatePresence>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => alert('Collection Submitted!')}
                startIcon={<SaveIcon />}
                disabled={!formData.photo}
              >
                Submit Collection
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                disabled={
                  (activeStep === 0 && !selectedFarmer) ||
                  (activeStep === 1 && (!formData.produceType || !formData.weight))
                }
              >
                Next Step
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
