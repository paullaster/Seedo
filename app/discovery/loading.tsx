import React from 'react';
import {
  Container,
  Box,
  Skeleton,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

export default function DiscoveryLoading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={60} />
        <Skeleton variant="text" width="60%" height={30} />
      </Box>

      {/* Search Bar Skeleton */}
      <Skeleton
        variant="rectangular"
        height={72}
        sx={{ borderRadius: 5, mb: 4 }}
      />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
            <Skeleton
              variant="rectangular"
              height={500}
              sx={{ borderRadius: 5 }}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{ borderRadius: 5 }}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
