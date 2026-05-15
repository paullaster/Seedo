'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Avatar,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  Phone,
  LocationOn,
  Agriculture,
  ArrowForward,
  ReportProblem,
} from '@mui/icons-material';
import { Agent } from '@/app/lib/types';

interface AgentCardProps {
  agent: Agent;
  onClick: () => void;
  distance?: string;
  highlight?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, distance = "Nearby (5km)", highlight }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        border: '2px solid',
        borderColor: highlight ? 'primary.main' : alpha('#000', 0.05),
        mb: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)',
        },
        bgcolor: highlight ? alpha('#1976d2', 0.02) : 'white',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            src={agent.avatarUrl}
            sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'primary.main' }}
          >
            {agent.name[0]}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {agent.name}
              </Typography>
              {agent.isVerified ? (
                <CheckCircle color="success" sx={{ fontSize: 24 }} />
              ) : (
                <ReportProblem color="warning" sx={{ fontSize: 24 }} />
              )}
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
              <LocationOn sx={{ fontSize: 16 }} />
              {agent.location.address} • <strong>{distance}</strong>
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {agent.acceptedProduce?.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  size="small"
                  icon={<Agriculture sx={{ fontSize: '14px !important' }} />}
                  sx={{ borderRadius: 1.5, fontWeight: 'bold' }}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Phone />}
                onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${agent.phone}`; }}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  bgcolor: '#f5f5f5',
                  color: 'text.primary',
                  '&:hover': { bgcolor: '#eeeeee' },
                  boxShadow: 'none',
                }}
              >
                Call Agent
              </Button>
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={onClick}
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
              >
                Details
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
