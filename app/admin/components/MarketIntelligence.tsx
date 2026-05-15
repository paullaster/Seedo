'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, InputAdornment, Stack, CircularProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Update, Public, PriceCheck } from '@mui/icons-material';
import { apiService } from '@/app/lib/api-service';
import { MarketRate } from '@/app/lib/types';

const MarketIntelligence = () => {
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await apiService.getMarketRates();
        setRates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handlePriceChange = (id: string, newPrice: string) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, pricePerKg: parseFloat(newPrice) || 0 } : r));
  };

  const handleUpdateRate = async (rate: MarketRate) => {
    try {
      await apiService.updateMarketRate(rate.id, { pricePerKg: rate.pricePerKg });
      alert(`Updated ${rate.produceType} global rate!`);
    } catch (err) {
      alert('Failed to update rate');
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

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
                value={rate.pricePerKg}
                onChange={(e) => handlePriceChange(rate.id, e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">KES</InputAdornment>,
                  endAdornment: <InputAdornment position="end">/KG</InputAdornment>,
                }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<PriceCheck />}
                onClick={() => handleUpdateRate(rate)}
                sx={{ borderRadius: 3, fontWeight: 'bold' }}
              >
                Update Global Rate
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MarketIntelligence;
