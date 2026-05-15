'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  Scale,
  Category,
  Grade,
  Info,
} from '@mui/icons-material';

interface IntakeFormProps {
  farmerName: string;
  onDataChange: (data: IntakeData) => void;
}

export interface IntakeData {
  produceType: string;
  weightKg: number;
  grade: 'A' | 'B' | 'C';
}

const PRODUCE_TYPES = ['Maize', 'Wheat', 'Beans', 'Rice', 'Sorghum', 'Barley'];

const IntakeForm: React.FC<IntakeFormProps> = ({ farmerName, onDataChange }) => {
  const [data, setData] = useState<IntakeData>({
    produceType: 'Maize',
    weightKg: 0,
    grade: 'A',
  });

  const handleChange = (field: keyof IntakeData, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
        <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Current Session
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          Intake for {farmerName}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            select
            fullWidth
            label="Produce Type"
            value={data.produceType}
            onChange={(e) => handleChange('produceType', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Category color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          >
            {PRODUCE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Net Weight"
            type="number"
            value={data.weightKg || ''}
            onChange={(e) => handleChange('weightKg', parseFloat(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Scale color="primary" />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">KG</InputAdornment>,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Grade fontSize="small" color="primary" /> Quality Grade
          </Typography>
          <ToggleButtonGroup
            value={data.grade}
            exclusive
            onChange={(_, val) => val && handleChange('grade', val)}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                py: 1.5,
                border: '1px solid #e0e0e0',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              },
              gap: 1,
            }}
          >
            <ToggleButton value="A" sx={{ borderLeft: '1px solid #e0e0e0 !important' }}>
              <Stack>
                <Typography variant="h6" fontWeight="bold">A</Typography>
                <Typography variant="caption">Premium</Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="B">
              <Stack>
                <Typography variant="h6" fontWeight="bold">B</Typography>
                <Typography variant="caption">Standard</Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="C">
              <Stack>
                <Typography variant="h6" fontWeight="bold">C</Typography>
                <Typography variant="caption">Utility</Typography>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ mt: 4, p: 2, bgcolor: '#fffde7', border: '1px solid #fff59d', borderRadius: 3 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Info color="warning" fontSize="small" sx={{ mt: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            Ensure the scale is zeroed before placing produce. Grade <strong>A</strong> requires moisture content below 13.5%.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default IntakeForm;
