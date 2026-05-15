'use client';
import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Chip, 
  Button, 
  useTheme, 
  alpha,
  Stack,
  CardActionArea,
  Divider
} from '@mui/material';
import { ProduceCollection } from '@/app/lib/types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import InvoiceDrawer from './InvoiceDrawer';

interface TransactionListProps {
  collections: ProduceCollection[];
}

const MotionGrid = motion(Grid);

export default function TransactionList({ collections }: TransactionListProps) {
  const theme = useTheme();
  const [selectedCollection, setSelectedCollection] = useState<ProduceCollection | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [visibleCount, setVisibleCount] = useState(6);

  const handleOpenDrawer = (collection: ProduceCollection) => {
    setSelectedCollection(collection);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCollection(null);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

    const filteredCollections = collections.filter(c => {

        if (filter === 'ALL') return true;

        if (filter === 'PAID') return c.status === 'PAID';

        return c.status === 'PENDING' || (c.status as any) === 'PARTIAL';

    });

  

    const displayCollections = filteredCollections.slice(0, visibleCount);

    const hasMore = visibleCount < filteredCollections.length;

  

    const getStatusColor = (status: string) => {

      switch (status) {

        case 'PAID': return 'success';

        case 'PENDING': return 'warning';

        case 'PARTIAL': return 'info';

        default: return 'default';

      }

    };

  

    const container = {

      hidden: { opacity: 0 },

      show: {

        opacity: 1,

        transition: {

          staggerChildren: 0.1

        }

      }

    };

  

    const item = {

      hidden: { opacity: 0, y: 20 },

      show: { opacity: 1, y: 0 }

    };

  

    return (

      <Box>

         <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Transaction History</Typography>

         

         {/* Filter Chips */}

         <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>

          {['ALL', 'PAID', 'PENDING'].map((status) => (

            <Chip 

              key={status}

              label={status === 'ALL' ? 'All Transactions' : status} 

              onClick={() => {

                  setFilter(status as 'ALL' | 'PAID' | 'PENDING');

                  setVisibleCount(6);

              }}

              color={filter === status ? 'primary' : 'default'}

              variant={filter === status ? 'filled' : 'outlined'}

              sx={{ fontWeight: 'bold'} }

              clickable

            />

          ))}

        </Stack>

  

        <motion.div variants={container} initial="hidden" animate="show">

        <Grid container spacing={2}>

          {displayCollections.map((collection) => (

            <MotionGrid size={{ xs: 12, md: 6, lg: 4 }} key={collection.id} variants={item}>

              <Card sx={{ 

                position: 'relative', 

                overflow: 'hidden',

                borderRadius: 4,

                border: '1px solid',

                borderColor: alpha(theme.palette.divider, 0.1),

                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,

                transition: 'all 0.3s ease',

                '&:hover': {

                  transform: 'translateY(-4px)',

                  boxShadow: `0 12px 40px 0 ${alpha(theme.palette.primary.main, 0.15)}`,

                  borderColor: alpha(theme.palette.primary.main, 0.3)

                }

              }}>

                <CardActionArea onClick={() => handleOpenDrawer(collection)} sx={{ height: '100%' }}>

                  <CardContent sx={{ p: 3 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>

                      <Box>

                        <Typography variant="caption" sx={{ 

                          color: 'text.secondary', 

                          display: 'block', 

                          mb: 0.5,

                          fontWeight: 600,

                          textTransform: 'uppercase',

                          letterSpacing: 0.5

                        }}>

                          {new Date(collection.timestamp).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}

                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>

                          {collection.produceType}

                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                           <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{collection.weightKg} kg</Box>

                           <span>@</span>

                           <span>KES {collection.pricePerKg}/kg</span>

                        </Typography>

                      </Box>

                      <Chip 

                        icon={collection.status === 'PAID' ? <CheckCircleIcon sx={{ fontSize: '16px !important' }} /> : <PendingIcon sx={{ fontSize: '16px !important' }} />}

                        label={collection.status} 

                        color={getStatusColor(collection.status) as 'success' | 'warning' | 'info' | 'default'}

                        size="small"

                        sx={{ 

                          fontWeight: 700, 

                          height: 24,

                          fontSize: '0.75rem'

                        }}

                      />

                    </Box>

  

                    <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: alpha(theme.palette.divider, 0.5) }} />

  

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                      <Box>

                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Total Value</Typography>

                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>

                          KES {collection.totalAmount.toLocaleString()}

                        </Typography>

                      </Box>

                      

                      <Button 

                          size="small" 

                          endIcon={<ArrowForwardIcon fontSize="small" />}

                          sx={{ 

                              borderRadius: 3,

                              textTransform: 'none',

                              fontWeight: 600,

                              bgcolor: alpha(theme.palette.primary.main, 0.1),

                              color: 'primary.main',

                              '&:hover': {

                                  bgcolor: alpha(theme.palette.primary.main, 0.2),

                              }

                          }}

                      >

                          Details

                      </Button>

                    </Box>

                  </CardContent>

                </CardActionArea>

              </Card>

            </MotionGrid>

          ))}

          

          {filteredCollections.length === 0 && (

              <Grid size={{ xs: 12 }}>

                  <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>

                      <Typography variant="h6" color="text.secondary">No records found</Typography>

                      <Typography variant="body2" color="text.secondary">Try adjusting the filters</Typography>

                  </Box>

              </Grid>

          )}

        </Grid>

  
      </motion.div>

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handleLoadMore}
            startIcon={<ExpandMoreIcon />}
            sx={{ 
                borderRadius: 4, 
                px: 4, 
                py: 1,
                borderWidth: 2,
                '&:hover': {
                    borderWidth: 2
                }
            }}
          >
            Load More Transactions
          </Button>
        </Box>
      )}

      <InvoiceDrawer 
        open={drawerOpen} 
        onClose={handleCloseDrawer} 
        collection={selectedCollection} 
      />
    </Box>
  );
}
