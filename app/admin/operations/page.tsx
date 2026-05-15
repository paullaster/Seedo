'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Speed,
  LocalShipping,
  AssignmentTurnedIn,
  ReportProblem,
  ArrowBack,
  FilterList,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function OperationsCenter() {
  const router = useRouter();

  const activities = [
    { id: 'ACT-001', type: 'COLLECTION', user: 'Kevin Omondi (Agent)', action: 'Verified 500KG Maize', status: 'SUCCESS', time: '10 mins ago' },
    { id: 'ACT-002', type: 'PAYMENT', user: 'Elias Mwaura (Farmer)', action: 'Payment Request Disbursed', status: 'SUCCESS', time: '25 mins ago' },
    { id: 'ACT-003', type: 'DISPUTE', user: 'Sarah Chebet (Farmer)', action: 'Raised Weight Dispute', status: 'WARNING', time: '1 hour ago' },
    { id: 'ACT-004', type: 'SYSTEM', user: 'Automated Bot', action: 'Daily Market Rates Synced', status: 'INFO', time: '2 hours ago' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => router.push('/admin')} sx={{ mb: 1 }}>
            Dashboard
          </Button>
          <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
            Operations Center
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            Real-time oversight of agents, logistics, and field activities.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 3 }}>
          Filter Activities
        </Button>
      </Box>

      {/* Operational KPIs */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Network Health', value: '99.8%', icon: <Speed />, color: '#2e7d32' },
          { label: 'Active Collectors', value: '24', icon: <LocalShipping />, color: '#1976d2' },
          { label: 'Pending Verifications', value: '12', icon: <AssignmentTurnedIn />, color: '#ffa000' },
          { label: 'Open Disputes', value: '2', icon: <ReportProblem />, color: '#d32f2f' },
        ].map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #eee', textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: `${kpi.color}15`, color: kpi.color, mx: 'auto', mb: 2, width: 56, height: 56 }}>
                {kpi.icon}
              </Avatar>
              <Typography variant="h4" fontWeight="900">{kpi.value}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">{kpi.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Activity Log */}
      <Typography variant="h5" fontWeight="900" sx={{ mb: 3 }}>Live Activity Stream</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 5, border: '1px solid #eee', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Entity / User</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Activity Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.id}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    sx={{ 
                      fontWeight: 'bold',
                      bgcolor: row.status === 'SUCCESS' ? '#e8f5e9' : row.status === 'WARNING' ? '#fff3e0' : '#e3f2fd',
                      color: row.status === 'SUCCESS' ? '#2e7d32' : row.status === 'WARNING' ? '#ef6c00' : '#1565c0',
                    }} 
                  />
                </TableCell>
                <TableCell color="text.secondary">{row.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
