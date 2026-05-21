'use client';

import { use, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, InputAdornment, Stack } from '@mui/material';
import { TrendingUp, TrendingDown, Public, PriceCheck } from '@mui/icons-material';
import { updateMarketRate } from '@/app/admin/markets/actions';
import type { MarketRate } from '@/app/lib/types';
import { Can } from '@/components/Can';
import { useCan } from '@/app/lib/permission-context';

const MarketIntelligence = ({ ratesPromise }: { ratesPromise: Promise<MarketRate[]> }) => {
  const initialRates = use(ratesPromise);
  const canUpdateMarketRate = useCan('produce.markets.create');
  const [rates, setRates] = useState<MarketRate[]>(initialRates);

  const handlePriceChange = (id: string, newPrice: string) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, pricePerKg: parseFloat(newPrice) || 0 } : r));
  };

  const handleUpdateRate = async (rate: MarketRate) => {
    try {
      await updateMarketRate(rate.id, { pricePerKg: rate.pricePerKg });
      alert(`Updated ${rate.produceType} global rate!`);
    } catch {
      alert('Failed to update rate');
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Public color="primary" /> Market Intelligence & Pricing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Set internal buying rates based on global and regional market trends.
      </Typography>

      <Grid container spacing={3}>
        {rates.map((rate) => (
          <Grid size={{ xs: 12, md: 4 }} key={rate.id}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{rate.produceType}</Typography>
              
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Global Market</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">KES {(rate.pricePerKg * 1.1).toFixed(2)}</Typography>
                    {rate.trend === 'UP' ? <TrendingUp color="success" fontSize="small" /> : <TrendingDown color="error" fontSize="small" />}
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Our Margin</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">10%</Typography>
                </Box>
              </Stack>

              <TextField
                fullWidth
                label="Our Buying Rate (Internal)"
                disabled={!canUpdateMarketRate}
                value={rate.pricePerKg}
                onChange={(e) => handlePriceChange(rate.id, e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">KES</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/KG</InputAdornment>,
                  }
                }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Can permission='produce.markets.create'>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PriceCheck />}
                onClick={() => handleUpdateRate(rate)}
                sx={{ borderRadius: 3, fontWeight: 'bold' }}
              >
                Update Global Rate
              </Button>
              </Can>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export function MarketIntelligenceSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: '#e0e0e0' }} />
        <Box sx={{ width: 280, height: 32, borderRadius: 1, bgcolor: '#e0e0e0' }} />
      </Box>
      <Box sx={{ width: 420, height: 20, borderRadius: 1, bgcolor: '#f0f0f0', mb: 4 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
            <Box sx={{ width: '60%', height: 24, bgcolor: '#e0e0e0', borderRadius: 1, mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '70%', height: 14, bgcolor: '#f0f0f0', borderRadius: 1, mb: 0.5 }} />
                <Box sx={{ width: '50%', height: 32, bgcolor: '#e0e0e0', borderRadius: 1 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '60%', height: 14, bgcolor: '#f0f0f0', borderRadius: 1, mb: 0.5 }} />
                <Box sx={{ width: '40%', height: 32, bgcolor: '#e0e0e0', borderRadius: 1 }} />
              </Box>
            </Box>
            <Box sx={{ width: '100%', height: 56, bgcolor: '#f0f0f0', borderRadius: 3, mb: 2 }} />
            <Box sx={{ width: '100%', height: 40, bgcolor: '#e0e0e0', borderRadius: 3 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MarketIntelligence;
