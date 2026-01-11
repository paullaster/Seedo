'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Growth/Agri Green
    },
    secondary: {
      main: '#FFA000', // Harvest Amber
    },
    info: {
      main: '#0288D1', // Deep Blue
    },
    error: {
      main: '#D32F2F', // Alert Red (mapped to error)
    },
    warning: {
      main: '#ED6C02', // Safety Orange
    },
    background: {
      default: '#F8F9FA', // Clean Grey/White
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44, // Minimum 44x44px for touch targets
        },
      },
    },
  },
});

export default theme;
