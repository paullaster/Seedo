'use client';
import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  useTheme,
  Drawer,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { ProduceCollection } from '@/app/lib/types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface InvoiceDrawerProps {
  open: boolean;
  onClose: () => void;
  collection: ProduceCollection | null;
}

export default function InvoiceDrawer({ open, onClose, collection }: InvoiceDrawerProps) {
  const theme = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [disputeAnchorEl, setDisputeAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmDisputeOpen, setConfirmDisputeOpen] = useState(false);
  const [selectedDisputeReason, setSelectedDisputeReason] = useState<string>('');

  if (!collection) return null;

  const isPaid = collection.status === 'PAID';
  const isPartial = (collection.status as any) === 'PARTIAL';

  // Stepper logic per PRD: Recorded -> Verified -> Payment Processing -> Paid
  const steps = [
    { label: 'Recorded', description: 'Agent collected produce and recorded weight.' },
    { label: 'Verified', description: 'Quality and weight verified by regional admin.' },
    { label: 'Payment Processing', description: 'Payment is being processed by the bank.' },
    { label: 'Paid', description: 'Funds disbursed to your account.' },
  ];

  const getActiveStep = () => {
    if (collection.status === 'PAID') return 4;
    if (collection.status === 'PENDING') return 1; // Assuming pending is after recorded/verified but before paid
    // Adjust logic based on actual status values available in types.ts. 
    // Assuming 'PENDING' encompasses the early stages for this prototype.
    return 1; 
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloaded ${isPaid ? 'Receipt' : 'Invoice'} #${collection.id}`);
    }, 1500);
  };

  const handleDisputeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDisputeAnchorEl(event.currentTarget);
  };

  const handleDisputeClose = () => {
    setDisputeAnchorEl(null);
  };

  const handleSelectDisputeReason = (reason: string) => {
    setSelectedDisputeReason(reason);
    setDisputeAnchorEl(null);
    setConfirmDisputeOpen(true);
  };

  const handleConfirmDispute = () => {
    setConfirmDisputeOpen(false);
    alert(`Dispute logged: ${selectedDisputeReason}. Freezing payment request.`);
    onClose();
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '90vh',
            background: theme.palette.background.paper,
          }
        }}
      >
        <Box sx={{ p: 3, maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {/* Handle for drawer */}
          <Box sx={{ width: 40, height: 4, bgcolor: 'divider', borderRadius: 2, mx: 'auto', mb: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLongIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {isPaid ? 'Payment Receipt' : 'Invoice Details'}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'rgba(0, 255, 157, 0.05)', borderRadius: 4, mb: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
              {isPaid ? 'Total Paid' : 'Amount Awaiting'}
            </Typography>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
              KES {collection.totalAmount.toLocaleString()}
            </Typography>
            <Chip
              label={collection.status}
              size="small"
              color={isPaid ? 'primary' : isPartial ? 'warning' : 'default'}
              sx={{ mt: 1, fontWeight: 'bold' }}
            />
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Payment Lifecycle</Typography>
              <Stepper activeStep={getActiveStep()} orientation="vertical">
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel 
                      optional={<Typography variant="caption">{step.description}</Typography>}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Collection Details</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Produce Type</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{collection.produceType} (Grade {collection.grade})</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Weight & Rate</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{collection.weightKg} kg @ KES {collection.pricePerKg}/kg</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Agent & Location</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{collection.agentId} • Kiambu Zone A</Typography>
                </Box>

                {collection.imageUrl && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <PhotoCameraIcon sx={{ fontSize: 14 }} /> Visual Weight Verification
                    </Typography>
                    <Box 
                      component="img" 
                      src={collection.imageUrl} 
                      sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }} 
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" spacing={2}>
            <Button 
              fullWidth
              onClick={handleDownload} 
              variant="contained" 
              size="large"
              startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
              disabled={downloading}
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              {downloading ? 'Downloading...' : `Get ${isPaid ? 'Receipt' : 'Invoice'}`}
            </Button>
            
            <Button 
              fullWidth
              onClick={handleDisputeClick} 
              variant="outlined" 
              color="error"
              size="large"
              startIcon={<ReportProblemIcon />}
              sx={{ borderRadius: 3, py: 1.5 }}
            >
              Instant Dispute
            </Button>
          </Stack>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3, pb: 2 }}>
            Secure transaction verified by AgriCollect Blockchain
          </Typography>
        </Box>
      </Drawer>

      <Menu
        anchorEl={disputeAnchorEl}
        open={Boolean(disputeAnchorEl)}
        onClose={handleDisputeClose}
      >
        <MenuItem onClick={() => handleSelectDisputeReason('Weight Discrepancy')}>Weight Discrepancy</MenuItem>
        <MenuItem onClick={() => handleSelectDisputeReason('Grade Issue')}>Grade Issue</MenuItem>
        <MenuItem onClick={() => handleSelectDisputeReason('Price Mismatch')}>Price Mismatch</MenuItem>
      </Menu>

      <Dialog
        open={confirmDisputeOpen}
        onClose={() => setConfirmDisputeOpen(false)}
      >
        <DialogTitle>Confirm Dispute</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log a dispute for <strong>{selectedDisputeReason}</strong>? 
            This will freeze the payment process while an admin reviews your case.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDisputeOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDispute} color="error" variant="contained">
            Confirm Dispute
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
