import React from 'react';
import { Container, Grid, Skeleton, Box, Stack } from '@mui/material';

export default function AgentDashboardLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="30%" height={50} />
        <Skeleton variant="text" width="50%" height={30} />
      </Box>

      <Stack spacing={4}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
        
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4 }} />
      </Stack>
    </Container>
  );
}
