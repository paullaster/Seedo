'use client';
import React, { useState } from 'react';
import { Typography, Paper, Button, Stack, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MotionPaper = motion(Paper);

export default function StatementGenerator() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRange, setSelectedRange] = useState('Last 3 Months');
  const [generating, setGenerating] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (range?: string) => {
    if (range) setSelectedRange(range);
    setAnchorEl(null);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`Statement for ${selectedRange} has been generated and sent to your email.`);
    }, 2000);
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      sx={{ 
        mt: 6, 
        p: 4, 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, rgba(0, 229, 255, 0.1) 100%)', 
        border: '1px solid rgba(0, 255, 157, 0.2)', 
        textAlign: 'center' 
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Need a Bank Statement?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
        Generate a branded financial statement to support your loan applications.
      </Typography>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button 
            variant="outlined" 
            onClick={handleOpen}
            startIcon={<CalendarMonthIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ borderRadius: 3, px: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
            {selectedRange}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
            <MenuItem onClick={() => handleClose('Last Month')}>Last Month</MenuItem>
            <MenuItem onClick={() => handleClose('Last 3 Months')}>Last 3 Months</MenuItem>
            <MenuItem onClick={() => handleClose('Last 6 Months')}>Last 6 Months</MenuItem>
            <MenuItem onClick={() => handleClose('YTD (Year to Date)')}>YTD (Year to Date)</MenuItem>
        </Menu>

        <Button 
            variant="contained" 
            onClick={handleGenerate}
            disabled={generating}
            startIcon={<PictureAsPdfIcon />}
            sx={{ borderRadius: 3, px: 4 }}
        >
            {generating ? 'Generating...' : 'Generate PDF'}
        </Button>
      </Stack>
    </MotionPaper>
  );
}
