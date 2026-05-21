import { Container, Box, Grid, Skeleton, Stack } from '@mui/material';

function SkeletonCard() {
  return (
    <Box sx={{ p: 3, borderRadius: 5, border: '1px solid #eee' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={18} sx={{ mt: 0.5 }} />
        </Box>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </Stack>
      </Stack>
      <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 16, mb: 1.5 }} />
      <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 3, mb: 2 }}>
        <Skeleton variant="text" width="45%" height={14} />
        <Skeleton variant="text" width="35%" height={36} sx={{ mt: 0.5 }} />
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 16 }} />
        <Skeleton variant="text" width="35%" height={14} />
      </Stack>
    </Box>
  );
}

export default function MarketsLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={280} height={48} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width={380} height={24} />
        </Box>
        <Skeleton variant="rounded" width={170} height={44} sx={{ borderRadius: 4 }} />
      </Box>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
