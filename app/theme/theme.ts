'use client';
import { createTheme, alpha } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

// Futuristic Agri-Tech Palette
const palette = {
  mode: 'dark' as const,
  primary: {
    main: '#00FF9D', // Neon Green
    light: '#69FFC2',
    dark: '#00CC7A',
    contrastText: '#0A1929',
  },
  secondary: {
    main: '#00E5FF', // Neon Cyan
    light: '#6EFFDD',
    dark: '#00B2CC',
    contrastText: '#0A1929',
  },
  background: {
    default: '#050B14', // Deep Space/Night Farm
    paper: '#0F1C2E', // Slightly lighter for cards
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#B0BEC5',
  },
  action: {
    hover: alpha('#00FF9D', 0.08),
    selected: alpha('#00FF9D', 0.16),
  },
};

const theme = createTheme({
  palette,
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: { fontWeight: 900, letterSpacing: '-0.02em', fontSize: '3.5rem' },
    h2: { fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: '0.05em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `radial-gradient(circle at 50% 0%, #1a3c30 0%, #050B14 70%)`,
          minHeight: '100vh',
          scrollbarColor: '#00FF9D #0F1C2E',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0F1C2E',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#00FF9D',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: alpha('#0F1C2E', 0.6), // Glass effect
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alpha('#00FF9D', 0.1)}`,
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: `0 0 15px ${alpha('#00FF9D', 0.4)}`,
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
          color: '#050B14',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha('#fff', 0.1)}`,
        },
      },
    },
  },
});

export default theme;