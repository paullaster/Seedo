import { Container, Box, Grid, Skeleton, Card, CardContent, Stack } from '@mui/material';

function StatCardSkeleton() {
  return (
    <Card elevation={0} sx={{ border: '1px solid #eee', borderRadius: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" width="50%" height={40} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
      </CardContent>
    </Card>
  );
}

function MarketCardSkeleton() {
  return (
    <Box sx={{ p: 3, borderRadius: 4, border: '1px solid #eee' }}>
      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={14} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="50%" height={32} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={14} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="40%" height={32} />
        </Box>
      </Stack>
      <Skeleton variant="rounded" width="100%" height={56} sx={{ mb: 2, borderRadius: 3 }} />
      <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 3 }} />
    </Box>
  );
}

export default function AdminDashboardLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={300} height={48} />
        <Skeleton variant="text" width={380} height={28} sx={{ mt: 0.5 }} />
      </Box>

      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <StatCardSkeleton />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Skeleton variant="rounded" width={28} height={28} />
          <Skeleton variant="text" width={280} height={32} />
        </Box>
        <Skeleton variant="text" width={420} height={20} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <MarketCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" width="100%" height={320} sx={{ borderRadius: 4 }} />
      </Box>
    </Container>
  );
}
