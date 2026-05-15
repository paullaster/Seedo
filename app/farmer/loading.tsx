import React from 'react';
import { Container, Grid, Skeleton, Box, Stack } from '@mui/material';

export default function DashboardLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={50} />
        <Skeleton variant="text" width="50%" height={30} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
