import React, { Suspense } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { apiService } from '@/app/lib/api-service';
import PaymentsList from './PaymentsList';
import { ProduceCollection } from '@/app/lib/types';

// Force dynamic rendering since we are fetching data that might change
export const dynamic = 'force-dynamic';

async function PaymentsContent() {
  // In a real app, we would get the session user ID here.
  // const session = await auth();
  // const farmerId = session?.user?.id;
  const farmerId = 'F001'; // Hardcoded for prototype as per plan

  const collections = await apiService.getFarmerCollections(farmerId);

  // Calculate totals for a summary
  const totalEarnings = collections
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const pendingAmount = collections
    .filter(c => c.status === 'PENDING' || c.status === 'PARTIAL')
    .reduce((sum, c) => sum + c.totalAmount, 0); // Simplified partial logic

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #00FF9D 30%, #00E5FF 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Earnings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your collections, invoices, and payments.
        </Typography>
      </Box>

      {/* Summary Cards - Could be a separate component but simple enough here */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: '200px', p: 3, borderRadius: 4, background: 'rgba(0, 255, 157, 0.05)', border: '1px solid rgba(0, 255, 157, 0.1)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Total Paid
            </Typography>
            <Typography variant="h4" sx={{ color: '#00FF9D', fontWeight: 700, mt: 1 }}>
                KES {totalEarnings.toLocaleString()}
            </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: '200px', p: 3, borderRadius: 4, background: 'rgba(237, 108, 2, 0.05)', border: '1px solid rgba(237, 108, 2, 0.1)' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Pending / Processing
            </Typography>
            <Typography variant="h4" sx={{ color: '#ED6C02', fontWeight: 700, mt: 1 }}>
                KES {pendingAmount.toLocaleString()}
            </Typography>
        </Box>
      </Box>

      <PaymentsList collections={collections} />
    </Box>
  );
}

export default function PaymentsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Suspense fallback={<PaymentsSkeleton />}>
        <PaymentsContent />
      </Suspense>
    </Box>
  );
}

function PaymentsSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
         <Skeleton variant="rectangular" height={120} sx={{ flex: 1, borderRadius: 4 }} />
         <Skeleton variant="rectangular" height={120} sx={{ flex: 1, borderRadius: 4 }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 2 }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
        ))}
      </Box>
    </Box>
  );
}