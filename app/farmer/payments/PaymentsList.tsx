'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip, 
  IconButton, 
  Button, 
  useTheme, 
  alpha,
  Stack
} from '@mui/material';
import { ProduceCollection } from '@/app/lib/types';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import InvoiceDialog from './InvoiceDialog';

interface PaymentsListProps {
  collections: ProduceCollection[];
}

export default function PaymentsList({ collections }: PaymentsListProps) {
  const theme = useTheme();
  const [selectedCollection, setSelectedCollection] = useState<ProduceCollection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  const handleOpenInvoice = (collection: ProduceCollection) => {
    setSelectedCollection(collection);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCollection(null);
  };

  const filteredCollections = collections.filter(c => {
      if (filter === 'ALL') return true;
      if (filter === 'PAID') return c.status === 'PAID';
      return c.status === 'PENDING' || c.status === 'PARTIAL';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'primary';
      case 'PENDING': return 'warning';
      case 'PARTIAL': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
       {/* Filter Chips */}
       <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        {['ALL', 'PAID', 'PENDING'].map((status) => (
          <Chip 
            key={status}
            label={status === 'ALL' ? 'All Transactions' : status} 
            onClick={() => setFilter(status as any)}
            color={filter === status ? 'primary' : 'default'}
            variant={filter === status ? 'filled' : 'outlined'}
            sx={{ fontWeight: 'bold' }}
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        {filteredCollections.map((collection) => (
          <Grid item xs={12} md={6} key={collection.id}>
            <Card sx={{ 
              position: 'relative', 
              overflow: 'visible',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.1)}`
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {new Date(collection.timestamp).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {collection.produceType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {collection.weightKg} kg @ {collection.pricePerKg}/kg
                    </Typography>
                  </Box>
                  <Chip 
                    icon={collection.status === 'PAID' ? <CheckCircleIcon /> : <PendingIcon />}
                    label={collection.status} 
                    color={getStatusColor(collection.status) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total</Typography>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                      KES {collection.totalAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        color="inherit"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenInvoice(collection)}
                        sx={{ borderRadius: 2 }}
                    >
                        Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {filteredCollections.length === 0 && (
            <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
                    <Typography variant="h6" color="text.secondary">No records found</Typography>
                    <Typography variant="body2" color="text.secondary">Try adjusting the filters</Typography>
                </Box>
            </Grid>
        )}
      </Grid>

      <InvoiceDialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        collection={selectedCollection} 
      />
    </Box>
  );
}