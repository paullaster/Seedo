'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  InputAdornment,
  CircularProgress,
  Avatar,
  Card,
  CardActionArea,
  Divider,
} from '@mui/material';
import {
  QrCodeScanner,
  Search,
  PersonAdd,
  Badge,
  CheckCircle,
} from '@mui/icons-material';
import { Farmer } from '@/app/lib/types';

interface FarmerDiscoveryProps {
  onFarmerSelected: (farmer: Farmer) => void;
  onNewFarmer: () => void;
  initialFarmers?: Farmer[];
}

const FarmerDiscovery: React.FC<FarmerDiscoveryProps> = ({ onFarmerSelected, onNewFarmer, initialFarmers = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Farmer[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 3) {
      setIsSearching(true);
      setTimeout(() => {
        const found = initialFarmers.filter(
          (f) =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.nationalId.includes(query) ||
            f.phone.includes(query)
        );
        setResults(found);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  };

  const toggleScanner = () => {
    setIsScanning(!isScanning);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Farmer Discovery
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Scan QR ID or search by National ID/Phone to start intake.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '2px dashed',
          borderColor: isScanning ? 'primary.main' : '#e0e0e0',
          borderRadius: 4,
          bgcolor: isScanning ? 'rgba(25, 118, 210, 0.04)' : '#fafafa',
          textAlign: 'center',
          mb: 4,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={toggleScanner}
      >
        {isScanning ? (
          <Box sx={{ py: 4 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              Scanning QR Code...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Align the farmer's ID within the frame
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 4 }}>
            <QrCodeScanner sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Tap to Scan QR
            </Typography>
            <Typography variant="caption" color="text.secondary">
              High-performance priority scan
            </Typography>
          </Box>
        )}
      </Paper>

      <Divider sx={{ mb: 4 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, bgcolor: 'background.default' }}>
          OR SEARCH MANUALLY
        </Typography>
      </Divider>

      <TextField
        fullWidth
        placeholder="Enter National ID or Phone Number"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: isSearching && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'white',
          },
        }}
      />

      <Stack spacing={2} sx={{ mb: 4 }}>
        {results.map((farmer) => (
          <Card
            key={farmer.id}
            elevation={0}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.02)' },
            }}
          >
            <CardActionArea onClick={() => onFarmerSelected(farmer)} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={farmer.avatarUrl} sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                  {farmer.name[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {farmer.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Badge sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {farmer.nationalId} • {farmer.phone}
                    </Typography>
                  </Stack>
                </Box>
                <CheckCircle color="primary" sx={{ opacity: 0.6 }} />
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<PersonAdd />}
        onClick={onNewFarmer}
        sx={{
          py: 2,
          borderRadius: 3,
          borderStyle: 'dashed',
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        Register New Farmer "On-the-fly"
      </Button>
    </Box>
  );
};

export default FarmerDiscovery;
