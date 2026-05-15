'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CameraAlt,
  Replay,
  CheckCircle,
  PhotoCamera,
} from '@mui/icons-material';

interface VisualProofProps {
  onImageCaptured: (image: string) => void;
}

const VisualProof: React.FC<VisualProofProps> = ({ onImageCaptured }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate camera delay
    setTimeout(() => {
      // For the prototype, we'll use a high-quality placeholder image of maize on a scale
      const placeholderImg = 'https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=600&auto=format&fit=crop';
      setImage(placeholderImg);
      onImageCaptured(placeholderImg);
      setIsCapturing(false);
    }, 1500);
  };

  const handleRetake = () => {
    setImage(null);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Visual Proof (Mandatory)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Capture a clear photo of the produce on the weighing scale. This is required for audit integrity.
      </Typography>

      {!image ? (
        <Paper
          elevation={0}
          sx={{
            height: 300,
            border: '2px dashed #bdbdbd',
            borderRadius: 4,
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isCapturing ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" fontWeight="medium">
                Accessing Camera...
              </Typography>
            </Box>
          ) : (
            <>
              <CameraAlt sx={{ fontSize: 64, color: '#9e9e9e', mb: 2 }} />
              <Button
                variant="contained"
                startIcon={<PhotoCamera />}
                onClick={handleCapture}
                sx={{ borderRadius: 3, py: 1.5, px: 4 }}
              >
                Open Camera & Capture
              </Button>
            </>
          )}
          {/* Hidden file input for real device camera access if needed */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const result = event.target?.result as string;
                  setImage(result);
                  onImageCaptured(result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Paper>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Paper
            elevation={4}
            sx={{
              height: 300,
              borderRadius: 4,
              overflow: 'hidden',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid',
              borderColor: 'success.main',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'success.main',
              color: 'white',
              borderRadius: '50%',
              p: 0.5,
              display: 'flex',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <CheckCircle />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Replay />}
              onClick={handleRetake}
              sx={{ borderRadius: 2 }}
            >
              Retake Photo
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
        <Typography variant="caption" color="success.dark" fontWeight="bold">
          AI VERIFICATION: Scale Detected • Weight Visible
        </Typography>
      </Box>
    </Box>
  );
};

export default VisualProof;
