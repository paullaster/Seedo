import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import WastageHeatmap from '../components/WastageHeatmap';

export default function WastagePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Button component={Link} href="/admin" startIcon={<ArrowBack />} sx={{ mb: 1 }}>
          Dashboard
        </Button>
        <Typography variant="h3" fontWeight="900" gutterBottom sx={{ letterSpacing: -1 }}>
          Wastage Tracker
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          Monitor shrinkage across collection hubs and stores.
        </Typography>
      </Box>
      <WastageHeatmap />
    </Container>
  );
}
