'use client';

import { use } from 'react';
import { Box, Typography, Paper, Grid, alpha, Stack, LinearProgress } from '@mui/material';
import { Warning, Store } from '@mui/icons-material';
import type { WastageRecord } from '@/app/lib/types';

const WastageHeatmap = ({ recordsPromise }: { recordsPromise: Promise<WastageRecord[]> }) => {
  const records = use(recordsPromise);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="error" /> Loss Prevention & Wastage
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Tracking &quot;The Black Hole&quot;: Intake Weight vs. Warehouse Delivery.
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

export function WastageHeatmapSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: '#e0e0e0' }} />
        <Box sx={{ width: 280, height: 32, borderRadius: 1, bgcolor: '#e0e0e0' }} />
      </Box>
      <Box sx={{ width: 440, height: 20, borderRadius: 1, bgcolor: '#f0f0f0', mb: 4 }} />
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Box sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: '#f0f0f0' }} />
                  <Box sx={{ width: 140, height: 24, borderRadius: 1, bgcolor: '#e0e0e0' }} />
                </Box>
                <Box sx={{ width: 100, height: 28, borderRadius: 1, bgcolor: '#e0e0e0' }} />
              </Box>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ width: 100, height: 16, borderRadius: 1, bgcolor: '#f0f0f0' }} />
                  <Box sx={{ width: 80, height: 16, borderRadius: 1, bgcolor: '#e0e0e0' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ width: 110, height: 16, borderRadius: 1, bgcolor: '#f0f0f0' }} />
                  <Box sx={{ width: 80, height: 16, borderRadius: 1, bgcolor: '#e0e0e0' }} />
                </Box>
              </Stack>
              <Box sx={{ width: '100%', height: 10, borderRadius: 5, bgcolor: '#f0f0f0' }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default WastageHeatmap;
