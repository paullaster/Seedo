'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GrassIcon from '@mui/icons-material/Grass'; // For Harvest
import PersonIcon from '@mui/icons-material/Person';

const farmerNavItems = [
  { title: 'Dashboard', path: '/farmer', icon: <DashboardIcon /> },
  { title: 'Harvest Notices', path: '/farmer/harvest', icon: <GrassIcon /> },
  { title: 'Payments', path: '/farmer/payments', icon: <AccountBalanceWalletIcon /> },
  { title: 'Profile', path: '/farmer/profile', icon: <PersonIcon /> },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={farmerNavItems} role="FARMER">
      {children}
    </DashboardLayout>
  );
}
