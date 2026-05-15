'use client';

import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Skeleton,
  Stack,
  Alert,
} from '@mui/material';
import AgentSearch from './AgentSearch';
import AgentMap from './AgentMap';
import AgentCard from './AgentCard';
import AgentDetailDrawer from './AgentDetailDrawer';
import type { Agent } from '@/app/lib/types';

interface DiscoveryClientProps {
  initialAgents: Agent[];
}

export default function DiscoveryClient({ initialAgents }: DiscoveryClientProps) {
  const [mode, setMode] = useState<'STORE' | 'COLLECTION'>('STORE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduce, setSelectedProduce] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredAgents = useMemo(() => {
    return initialAgents.filter((agent) => {
      // 1. Filter by Mode
      if (agent.agentType !== mode) return false;

      // 2. Filter by Produce
      if (selectedProduce && !agent.acceptedProduce?.includes(selectedProduce)) return false;

      // 3. Filter by Search Query (ID Search Logic)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        // Priority ID match
        if (/^\d{7,10}$/.test(query)) {
          return agent.nationalId?.includes(query);
        }
        // General search
        return (
          agent.name.toLowerCase().includes(query) ||
          agent.location.address.toLowerCase().includes(query) ||
          agent.id.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [mode, searchQuery, selectedProduce]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
  };

  const center = { lat: -1.2921, lng: 36.8219 }; // Default center (Nairobi)

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          AgriCollect Directory
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Find verified stores and collectors near you.
        </Typography>
      </Box>

      <AgentSearch
        mode={mode}
        selectedProduce={selectedProduce}
        onSearch={setSearchQuery}
        onToggleMode={setMode}
        onFilterProduce={setSelectedProduce}
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {filteredAgents.length} Agents Found in this area
            </Typography>
            <AgentMap
              agents={filteredAgents}
              onAgentSelect={handleAgentSelect}
              center={center}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Verified Search Results
          </Typography>
          <Stack spacing={2}>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: 5 }} />
              ))
            ) : filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onClick={() => handleAgentSelect(agent)}
                  highlight={searchQuery.length >= 7 && agent.nationalId?.includes(searchQuery)}
                />
              ))
            ) : (
              <Alert severity="info" sx={{ borderRadius: 4, py: 2 }}>
                <Typography fontWeight="bold">No agents found matching your criteria.</Typography>
                Try adjusting your filters or search area.
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>

      <AgentDetailDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        agent={selectedAgent}
      />
    </Container>
  );
}
