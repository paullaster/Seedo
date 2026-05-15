'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  MyLocation,
  Launch,
  Navigation,
} from '@mui/icons-material';
import { getGeoLocation, reverseGeocode } from '@/app/lib/geo-utils';
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from '@vis.gl/react-google-maps';

interface SmartLocationProps {
  initialLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  onUpdate: (location: { lat: number; lng: number; address: string }) => void;
}

const SmartLocation: React.FC<SmartLocationProps> = ({ initialLocation, onUpdate }) => {
  const [location, setLocation] = useState(initialLocation);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await getGeoLocation();
      const info = await reverseGeocode(coords.lat, coords.lng);
      const newLoc = { ...coords, address: info.address };
      setLocation(newLoc);
      onUpdate(newLoc);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleMapClick = async (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    const { lat, lng } = e.detail.latLng;
    setIsLocating(true);
    try {
      const info = await reverseGeocode(lat, lng);
      const newLoc = { lat, lng, address: info.address };
      setLocation(newLoc);
      onUpdate(newLoc);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLocating(false);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e0e0e0', mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn color="primary" /> Farm Location
      </Typography>

      <Box sx={{ mt: 2, mb: 3 }}>
        <Box
          sx={{
            width: '100%',
            height: 250,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #bbdefb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={location}
                center={location}
                defaultZoom={15}
                mapId="FARM_LOCATION_PICKER"
                onClick={handleMapClick}
                disableDefaultUI={true}
                gestureHandling={'greedy'}
              >
                <AdvancedMarker position={location}>
                  <LocationOn color="primary" sx={{ fontSize: 40, transform: 'translateY(-20px)' }} />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">Map API Key Missing</Typography>
            </Box>
          )}

          {isLocating && (
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <Button
            variant="contained"
            size="small"
            startIcon={<MyLocation />}
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              borderRadius: 2,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: '#f5f5f5' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 5,
            }}
          >
            Pin Current Location
          </Button>
        </Box>

        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
          Tap on the map to precisely pin your farm location.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Farm Address / Directions"
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
            variant="outlined"
            placeholder="e.g., 2km off Eldoret-Kitale Highway"
            multiline
            rows={2}
          />
          <Tooltip title="View Nearest Collection Store">
            <IconButton
              color="primary"
              sx={{
                bgcolor: '#f1f8e9',
                borderRadius: 2,
                '&:hover': { bgcolor: '#e8f5e9' },
                width: 56,
                height: 56,
              }}
            >
              <Navigation />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<Launch />}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        View nearby service centers & collection points
      </Button>
    </Paper>
  );
};

export default SmartLocation;
