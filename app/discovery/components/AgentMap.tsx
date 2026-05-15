'use client';

import React, { useState, useCallback } from 'react';
import { Box, Button, Typography, Paper, Stack, CircularProgress } from '@mui/material';
import { LocationOn, Search } from '@mui/icons-material';
import { Agent } from '@/app/lib/types';
import { APIProvider, Map, AdvancedMarker, Pin, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

interface AgentMapProps {
  agents: Agent[];
  onAgentSelect: (agent: Agent) => void;
  center: { lat: number; lng: number };
}

const AgentMap: React.FC<AgentMapProps> = ({ agents, onAgentSelect, center }) => {
  const [mapCenter, setMapCenter] = useState(center);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setMapCenter(ev.detail.center);
  }, []);

  const handleSearchArea = () => {
    // In a real app, this would trigger a re-fetch based on the new map bounds/center
    console.log('Searching area around:', mapCenter);
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Box
        sx={{
          width: '100%',
          height: { xs: 300, md: 500 },
          bgcolor: '#e0f2f1',
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #b2dfdb',
        }}
      >
        <Typography color="error">
          Google Maps API Key is missing. Please check your .env configuration.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 300, md: 500 },
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <APIProvider apiKey={apiKey} onLoad={() => setIsMapLoading(false)}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
          onCameraChanged={handleCameraChange}
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
        >
          {agents.map((agent) => (
            <AdvancedMarker
              key={agent.id}
              position={agent.location}
              onClick={() => onAgentSelect(agent)}
            >
              <Pin
                background={agent.agentType === 'STORE' ? '#2e7d32' : '#1976d2'}
                borderColor={'#ffffff'}
                glyphColor={'#ffffff'}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {isMapLoading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <Button
        variant="contained"
        startIcon={<Search />}
        onClick={handleSearchArea}
        sx={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: 10,
          bgcolor: 'white',
          color: 'primary.main',
          '&:hover': { bgcolor: '#f5f5f5' },
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textTransform: 'none',
          fontWeight: 'bold',
          zIndex: 5,
        }}
      >
        Search this area
      </Button>

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          p: 1,
          bgcolor: 'rgba(255,255,255,0.95)',
          borderRadius: 2,
          display: 'flex',
          gap: 2,
          zIndex: 5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2e7d32' }} />
          <Typography variant="caption" fontWeight="bold">Store</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1976d2' }} />
          <Typography variant="caption" fontWeight="bold">Collector</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default AgentMap;
