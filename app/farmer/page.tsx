'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Chip, Button, IconButton, Stack, useTheme, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, CircularProgress as MuiCircularProgress } from '@mui/material';
import { MOCK_WEATHER, MOCK_MARKET_RATES, MOCK_COLLECTIONS, MOCK_AGENTS } from '@/app/lib/mock-data';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { calculateDistance } from '@/app/lib/geo-utils';
import { isFarmer, Farmer } from '@/app/lib/types';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmailIcon from '@mui/icons-material/Email';
import PrintIcon from '@mui/icons-material/Print';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

export default function FarmerDashboard() {
  const theme = useTheme();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user as Farmer | undefined;
  const router = useRouter();
  const [nearestAgent, setNearestAgent] = useState<{ agent: any, distance: number } | null>(null);
  
  // Invoice Dialog State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && isFarmer(user) && user.location) {
      // Find nearest agent
      let minDistance = Infinity;
      let closest = null;

      MOCK_AGENTS.forEach(agent => {
        // Assuming Agent 1 is at -1.29, 36.82 (Nairobi) and Agent 2 is at -0.51, 35.26 (Eldoret)
        const agentLoc = agent.id === 'A001' ? { lat: -1.2921, lng: 36.8219 } : { lat: -0.5143, lng: 35.2698 };
        
        const dist = calculateDistance(user.location.lat, user.location.lng, agentLoc.lat, agentLoc.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closest = agent;
        }
      });

      if (closest) {
        setNearestAgent({ agent: closest, distance: minDistance });
      }
    }
  }, [user]);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  const handleResendReceipt = () => {
    setSnackbarMessage(`Receipt sent to ${user?.email}`);
    setSnackbarOpen(true);
  };

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <MuiCircularProgress />
    </Box>
  );

  if (!user) return null;

  return (
    <Box>
      {/* 1. Weather & Welcome Section */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box>
            <Typography variant="h4" fontWeight="900" gutterBottom>
              Welcome back, {user.name?.split(' ')[0]}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here is your farm's performance overview for today.
            </Typography>
            
            {nearestAgent && (
              <Alert 
                icon={<LocationOnIcon fontSize="inherit" />} 
                severity="info" 
                sx={{ mt: 2, bgcolor: 'rgba(2,136,209,0.1)', border: '1px solid rgba(2,136,209,0.2)' }}
              >
                Nearest Collection Agent: <strong>{nearestAgent.agent.name}</strong> is <strong>{nearestAgent.distance}km</strong> away.
              </Alert>
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MotionCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
              color: '#000'
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Weather Alert</Typography>
                <Typography variant="h3" fontWeight="900">{MOCK_WEATHER.temp}°C</Typography>
                <Typography variant="body2" fontWeight="500">{MOCK_WEATHER.forecast}</Typography>
              </Box>
              <WbSunnyIcon sx={{ fontSize: 60, opacity: 0.8 }} />
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* 2. Market Rates Ticker */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <TrendingUpIcon color="primary" /> Live Market Rates
        </Typography>
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
          {MOCK_MARKET_RATES.map((rate) => (
            <MotionCard 
              key={rate.id}
              whileHover={{ y: -5 }}
              sx={{ minWidth: 200, bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{rate.produceType}</Typography>
                <Stack direction="row" alignItems="flex-end" spacing={1}>
                  <Typography variant="h5" fontWeight="bold">KES {rate.pricePerKg}</Typography>
                  <Typography variant="caption" color="text.secondary">/kg</Typography>
                </Stack>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {rate.trend === 'UP' && <TrendingUpIcon fontSize="small" color="primary" />}
                  {rate.trend === 'DOWN' && <TrendingDownIcon fontSize="small" color="error" />}
                  {rate.trend === 'STABLE' && <TrendingFlatIcon fontSize="small" color="info" />}
                  <Typography variant="caption" color={rate.trend === 'UP' ? 'primary' : rate.trend === 'DOWN' ? 'error' : 'info.main'}>
                    {rate.trend} today
                  </Typography>
                </Box>
              </CardContent>
            </MotionCard>
          ))}
        </Stack>
      </Box>

      {/* 3. Invoices / Recent Collections */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">My Invoices & Collections</Typography>
            <Button variant="outlined" size="small">View Full History</Button>
          </Box>
          
          <Stack spacing={2}>
            {MOCK_COLLECTIONS.map((collection) => (
              <MotionCard 
                key={collection.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                sx={{ bgcolor: 'background.paper' }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '16px !important' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${theme.palette.primary.main}15`, color: theme.palette.primary.main }}>
                      <ReceiptIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Invoice #{collection.id.split('-')[1]}</Typography>
                      <Typography variant="body2" color="text.secondary">
                         {collection.produceType} • {collection.weightKg}kg • Grade {collection.grade}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(collection.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      KES {collection.totalAmount.toLocaleString()}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" mt={0.5}>
                      <Chip 
                        label={collection.status} 
                        size="small" 
                        color={collection.status === 'PAID' ? 'success' : collection.status === 'PENDING' ? 'warning' : 'info'}
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Button 
                        size="small" 
                        sx={{ minWidth: 0, p: 0.5 }}
                        onClick={() => handleViewInvoice(collection)}
                      >
                         View
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </MotionCard>
            ))}
          </Stack>
        </Grid>

        {/* 4. Quick Actions Side Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MotionCard sx={{ height: '100%', bgcolor: 'background.paper', border: `1px solid ${theme.palette.primary.main}30` }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2} mt={2}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ py: 2 }}
                  onClick={() => router.push('/farmer/harvest')}
                >
                  New Harvest Notice
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large"
                >
                  My QR Code
                </Button>
              </Stack>

              <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                 <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                   FARMER PROFILE
                 </Typography>
                 <Typography variant="body2" color="primary.main">
                   ● Verified Account
                 </Typography>
                 <Typography variant="body2" color="text.secondary" mt={0.5}>
                   {isFarmer(user) ? (user.location?.address || 'Location not set') : ''}
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   ID: {isFarmer(user) ? user.nationalId : ''}
                 </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Invoice Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 500 } }}
      >
        {selectedInvoice && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Collection Receipt</Typography>
                <Typography variant="caption" color="text.secondary">ID: {selectedInvoice.id}</Typography>
              </Box>
              <Chip label={selectedInvoice.status} color="success" size="small" />
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Date</Typography>
                  <Typography fontWeight="bold">{new Date(selectedInvoice.timestamp).toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Farmer</Typography>
                  <Typography fontWeight="bold">{user.name}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Agent</Typography>
                  <Typography fontWeight="bold">Agent #{selectedInvoice.agentId}</Typography>
                </Box>
                <Box sx={{ my: 2, borderTop: '1px dashed grey', borderBottom: '1px dashed grey', py: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Produce Type</Typography>
                    <Typography fontWeight="bold">{selectedInvoice.produceType}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Weight</Typography>
                    <Typography fontWeight="bold">{selectedInvoice.weightKg} kg</Typography>
                  </Box>
                   <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Grade</Typography>
                    <Typography fontWeight="bold">{selectedInvoice.grade}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Rate</Typography>
                    <Typography fontWeight="bold">{selectedInvoice.pricePerKg} / kg</Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total Payout</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="900">KES {selectedInvoice.totalAmount.toLocaleString()}</Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button startIcon={<PrintIcon />}>Print</Button>
              <Button 
                variant="contained" 
                startIcon={<EmailIcon />} 
                onClick={handleResendReceipt}
              >
                Resend Receipt
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}