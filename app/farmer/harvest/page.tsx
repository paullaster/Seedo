'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Stack, 
  Drawer, 
  TextField, 
  MenuItem, 
  InputAdornment,
  Fab,
  useTheme,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { MOCK_HARVEST_NOTICES, MOCK_MARKET_RATES } from '@/app/lib/mock-data';
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const MotionCard = motion(Card);

export default function HarvestPage() {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notices, setNotices] = useState(MOCK_HARVEST_NOTICES);
  
  // Form State
  const [formData, setFormData] = useState({
    produceType: '',
    estimatedWeight: '',
    readyDate: ''
  });

  const handleSubmit = () => {
    // Add new notice to local state (mock)
    const newNotice = {
      id: `HN-${Math.floor(Math.random() * 10000)}`,
      farmerId: 'F001',
      produceType: formData.produceType,
      estimatedWeightKg: parseInt(formData.estimatedWeight),
      readyDate: formData.readyDate,
      status: 'OPEN' as const
    };
    
    setNotices([newNotice, ...notices]);
    setIsDrawerOpen(false);
    setFormData({ produceType: '', estimatedWeight: '', readyDate: '' });
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setIsDrawerOpen(open);
  };

  return (
    <Box sx={{ pb: 10 }}> {/* Padding for FAB */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
           <Typography variant="h4" fontWeight="900" gutterBottom>
            Harvest Notices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Notify agents when your produce is ready for collection.
          </Typography>
        </Box>
      </Box>

      {/* List of Notices */}
      <Stack spacing={2}>
        {notices.length === 0 ? (
          <Box textAlign="center" py={8} color="text.secondary">
            <GrassIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
            <Typography>No active harvest notices.</Typography>
          </Box>
        ) : (
          notices.map((notice) => (
            <MotionCard 
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ bgcolor: 'background.paper', borderLeft: `4px solid ${
                notice.status === 'OPEN' ? theme.palette.warning.main : 
                notice.status === 'ACKNOWLEDGED' ? theme.palette.info.main : 
                theme.palette.success.main
              }` }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{notice.produceType}</Typography>
                    <Typography variant="body2" color="text.secondary">Est. {notice.estimatedWeightKg} kg</Typography>
                  </Box>
                  <Chip 
                    label={notice.status} 
                    size="small" 
                    color={
                      notice.status === 'OPEN' ? 'warning' : 
                      notice.status === 'ACKNOWLEDGED' ? 'info' : 'success'
                    }
                    icon={
                      notice.status === 'OPEN' ? <AccessTimeIcon /> : 
                      notice.status === 'ACKNOWLEDGED' ? <CheckCircleIcon /> : undefined
                    }
                  />
                </Box>
                
                <Stack direction="row" spacing={2} alignItems="center" color="text.secondary">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="caption">Ready: {new Date(notice.readyDate).toLocaleDateString()}</Typography>
                  </Box>
                  <Typography variant="caption">ID: {notice.id}</Typography>
                </Stack>
              </CardContent>
            </MotionCard>
          ))
        )}
      </Stack>

      {/* Floating Action Button for Mobile */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => setIsDrawerOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Create Notice Drawer */}
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, p: 3, maxHeight: '85vh' }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
          <Box sx={{ width: 40, height: 4, bgcolor: 'divider', borderRadius: 2, mx: 'auto', mb: 3 }} />
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Report Harvest
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Let agents know what produce you have ready.
          </Typography>

          <Stack spacing={3} mt={2}>
            <TextField
              select
              label="Produce Type"
              value={formData.produceType}
              onChange={(e) => setFormData({...formData, produceType: e.target.value})}
              fullWidth
            >
              {MOCK_MARKET_RATES.map((rate) => (
                <MenuItem key={rate.id} value={rate.produceType}>
                  {rate.produceType}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Estimated Weight"
              type="number"
              value={formData.estimatedWeight}
              onChange={(e) => setFormData({...formData, estimatedWeight: e.target.value})}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
            />

            <TextField
              label="Ready Date"
              type="date"
              value={formData.readyDate}
              onChange={(e) => setFormData({...formData, readyDate: e.target.value})}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Alert severity="info">
              Agents in your area (Kiambu Zone A) will be notified immediately.
            </Alert>

            <Button 
              variant="contained" 
              size="large" 
              fullWidth 
              onClick={handleSubmit}
              disabled={!formData.produceType || !formData.estimatedWeight || !formData.readyDate}
              sx={{ mt: 2 }}
            >
              Submit Notice
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
