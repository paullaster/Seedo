'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  Search,
  MyLocation,
  Store,
  LocalShipping,
  Agriculture,
} from '@mui/icons-material';

interface AgentSearchProps {
  onSearch: (query: string) => void;
  onToggleMode: (mode: 'STORE' | 'COLLECTION') => void;
  onFilterProduce: (produce: string | null) => void;
  mode: 'STORE' | 'COLLECTION';
  selectedProduce: string | null;
  produceTypes: string[];
}

const AgentSearch: React.FC<AgentSearchProps> = ({
  onSearch,
  onToggleMode,
  onFilterProduce,
  mode,
  selectedProduce,
  produceTypes,
}) => {
  const [query, setQuery] = useState('');

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant={mode === 'STORE' ? 'contained' : 'outlined'}
          startIcon={<Store />}
          onClick={() => onToggleMode('STORE')}
          sx={{
            py: 2.5,
            borderRadius: 5,
            fontWeight: '900',
            fontSize: '1.1rem',
            borderWidth: 2,
            boxShadow: mode === 'STORE' ? '0 8px 20px rgba(46, 125, 50, 0.3)' : 'none',
            '&:hover': { borderWidth: 2 },
          }}
        >
          I am delivering crops
        </Button>
        <Button
          fullWidth
          variant={mode === 'COLLECTION' ? 'contained' : 'outlined'}
          startIcon={<LocalShipping />}
          onClick={() => onToggleMode('COLLECTION')}
          sx={{
            py: 2.5,
            borderRadius: 5,
            fontWeight: '900',
            fontSize: '1.1rem',
            borderWidth: 2,
            boxShadow: mode === 'COLLECTION' ? '0 8px 20px rgba(25, 118, 210, 0.3)' : 'none',
            '&:hover': { borderWidth: 2 },
          }}
        >
          I need a pickup
        </Button>
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          placeholder={mode === 'STORE' ? "Type Store Name or Town..." : "Type Agent Name or ID..."}
          value={query}
          onChange={handleQueryChange}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ fontSize: 32, color: 'primary.main', ml: 1 }} />,
              endAdornment: <Button
                variant="contained"
                color="secondary"
                startIcon={<MyLocation />}
                sx={{
                  borderRadius: 4,
                  mr: 0.5,
                  py: 1.5,
                  px: 3,
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(255, 160, 0, 0.4)'
                }}
              >
                Find Near Me
              </Button>
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              height: 80,
              fontSize: '1.25rem',
              color: 'black',
              bgcolor: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              '& fieldset': { border: '1px solid rgba(0,0,0,0.05)' },
              '&:hover fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, ml: 2, display: 'block', color: 'text.secondary', fontWeight: 600 }}>
           💡 TIP: You can search by National ID to verify an agent instantly.
        </Typography>
      </Box>

      <Box sx={{ mt: 4, overflowX: 'auto', pb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2" fontWeight="900" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 1 }}>
          Filter by Crop:
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Chip
            icon={<Agriculture />}
            label="All Produce"
            onClick={() => onFilterProduce(null)}
            color={selectedProduce === null ? 'primary' : 'default'}
            sx={{ px: 2, py: 3, borderRadius: 4, fontSize: '1rem', fontWeight: 'bold' }}
          />
          {produceTypes.map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => onFilterProduce(type)}
              variant={selectedProduce === type ? 'filled' : 'outlined'}
              color={selectedProduce === type ? 'primary' : 'default'}
              sx={{ px: 2, py: 3, borderRadius: 4, fontSize: '1rem', fontWeight: 'bold', border: '2px solid' }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default AgentSearch;
