'use client';

import React, { use } from 'react';
import { Box, Grid, Typography, Card, CardContent, alpha } from '@mui/material';
import {
  Group,
  AccountBalanceWallet,
  Inventory,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { DashboardStat } from '@/app/admin/stats/actions';

const iconMap: Record<string, React.ReactNode> = {
  tonnage: <Inventory />,
  loans: <AccountBalanceWallet />,
  farmers: <Group />,
  wastage: <Warning />,
};

const AdminStats = ({ statsPromise }: { statsPromise: Promise<DashboardStat[]> }) => {
  const stats = use(statsPromise);

  return (
    <Grid container spacing={3}>
      {stats.map((stat, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.key}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(stat.color, 0.1), color: stat.color }}>
                    {iconMap[stat.key]}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: stat.trend.startsWith('+') ? '#e8f5e9' : '#ffebee',
                      color: stat.trend.startsWith('+') ? '#2e7d32' : '#c62828',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {stat.trend}
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="900" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export function AdminStatsSkeleton() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 3 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Box key={i} sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: '#e0e0e0' }} />
            <Box sx={{ width: 60, height: 24, borderRadius: 1, bgcolor: '#e0e0e0' }} />
          </Box>
          <Box sx={{ width: '50%', height: 40, bgcolor: '#e0e0e0', borderRadius: 1, mb: 0.5 }} />
          <Box sx={{ width: '70%', height: 20, bgcolor: '#f0f0f0', borderRadius: 1 }} />
        </Box>
      ))}
    </Box>
  );
}

export default AdminStats;
