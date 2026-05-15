'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { PhotoCamera, Agriculture, Storefront } from '@mui/icons-material';

interface IdentityPersonalizationProps {
  initialFarmName: string;
  initialCrops: string[];
  avatarUrl?: string;
  onUpdate: (data: { farmName: string; crops: string[] }) => void;
}

const AVAILABLE_CROPS = ['Maize', 'Wheat', 'Beans', 'Rice', 'Sorghum', 'Coffee', 'Tea', 'Barley'];

const IdentityPersonalization: React.FC<IdentityPersonalizationProps> = ({
  initialFarmName,
  initialCrops,
  avatarUrl,
  onUpdate,
}) => {
  const [farmName, setFarmName] = useState(initialFarmName);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(initialCrops);

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSave = () => {
    onUpdate({ farmName, crops: selectedCrops });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0', mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Storefront color="primary" /> Farm Identity
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl}
              sx={{ width: 120, height: 120, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <input hidden accept="image/*" type="file" />
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Profile Photo
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            label="Digital Farm Name"
            placeholder="e.g., Maziwa Bora Farm"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Agriculture fontSize="small" color="primary" /> Crop Specialties
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            Pick your primary crops to personalize your market price feed.
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {AVAILABLE_CROPS.map((crop) => (
              <Chip
                key={crop}
                label={crop}
                onClick={() => toggleCrop(crop)}
                color={selectedCrops.includes(crop) ? 'primary' : 'default'}
                variant={selectedCrops.includes(crop) ? 'filled' : 'outlined'}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={handleSave}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default IdentityPersonalization;
