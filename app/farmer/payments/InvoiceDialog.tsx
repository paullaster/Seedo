'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import { ProduceCollection } from '@/app/lib/types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  collection: ProduceCollection | null;
}

export default function InvoiceDialog({ open, onClose, collection }: InvoiceDialogProps) {
  const theme = useTheme();
  const [downloading, setDownloading] = useState(false);

  if (!collection) return null;

  const isPaid = collection.status === 'PAID';
  const isPartial = collection.status === 'PARTIAL';

  const handleDownload = () => {
    setDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setDownloading(false);
      // In a real app, this would trigger a file download
      alert(`Downloaded ${isPaid ? 'Receipt' : 'Invoice'} #${collection.id}`);
    }, 1500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(16px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: `1px solid ${alpha('#fff', 0.05)}` }}>
        <ReceiptLongIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          {isPaid ? 'Payment Receipt' : 'Collection Invoice'}
        </Typography>
        <Chip
          label={collection.status}
          size="small"
          color={isPaid ? 'primary' : isPartial ? 'warning' : 'default'}
          sx={{ ml: 'auto', fontWeight: 'bold' }}
        />
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">Total Amount</Typography>
            <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800 }}>
              KES {collection.totalAmount.toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Collection ID</Typography>
              <Typography variant="body1">{collection.id}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography variant="body1">
                {new Date(collection.timestamp).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Produce</Typography>
              <Typography variant="body1">{collection.produceType} (Grade {collection.grade})</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Weight</Typography>
              <Typography variant="body1">{collection.weightKg} kg</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Rate</Typography>
              <Typography variant="body1">KES {collection.pricePerKg} / kg</Typography>
            </Grid>
             <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Agent</Typography>
              <Typography variant="body1">{collection.agentId}</Typography>
            </Grid>
          </Grid>
          
          {collection.imageUrl && (
             <Box sx={{ mt: 2, p: 1, border: `1px dashed ${alpha('#fff', 0.1)}`, borderRadius: 2 }}>
                 <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                     Visual Verification
                 </Typography>
                 {/* Placeholder for image */}
                 <Box sx={{ height: 100, bgcolor: alpha('#000', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Typography variant="caption">Image Preview</Typography>
                 </Box>
             </Box>
          )}

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha('#fff', 0.05)}` }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button 
          onClick={handleDownload} 
          variant="contained" 
          startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : `Download ${isPaid ? 'Receipt' : 'Invoice'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}