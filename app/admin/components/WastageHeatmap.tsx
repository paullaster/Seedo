'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, alpha, Stack, LinearProgress } from '@mui/material';
import { Warning, Store } from '@mui/icons-material';

interface WastageRecord {
  storeId: string;
  produceType: string;
  intakeWeight: number;
  warehouseWeight: number;
  shrinkagePercentage: number;
  timestamp: string;
}

const WastageHeatmap = () => {
  const [records, setRecords] = useState<WastageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wastage')
      .then(res => res.ok ? res.json() : [])
      .then(data => { setRecords(Array.isArray(data) ? data : []); })
      .catch(() => { setRecords([]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" /> Loss Prevention & Wastage
        </Typography>
        <Typography variant="body2" color="text.secondary">Loading wastage data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" /> Loss Prevention & Wastage
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Tracking "The Black Hole": Intake Weight vs. Warehouse Delivery.
      </Typography>

      <Grid container spacing={3}>
        {records.map((record, idx) => (
          <Grid size={{ xs: 12, md: 6 }} key={idx}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Store color="action" />
                  <Typography variant="subtitle1" fontWeight="bold">{record.storeId}</Typography>
                </Stack>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: record.shrinkagePercentage > 2 ? 'error.main' : 'success.main' }}
                >
                  {record.shrinkagePercentage}% Shrinkage
                </Typography>
              </Stack>

              <Stack spacing={1} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Intake Weight</Typography>
                  <Typography variant="body2" fontWeight="bold">{record.intakeWeight.toLocaleString()} KG</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Actual Received</Typography>
                  <Typography variant="body2" fontWeight="bold">{record.warehouseWeight.toLocaleString()} KG</Typography>
                </Box>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={100 - record.shrinkagePercentage}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: alpha(record.shrinkagePercentage > 2 ? '#c62828' : '#2e7d32', 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: record.shrinkagePercentage > 2 ? 'error.main' : 'success.main',
                  }
                }}
              />

              {record.shrinkagePercentage > 2 && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                  ALERT: Shrinkage exceeds 2% threshold. Investigation required.
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WastageHeatmap;
