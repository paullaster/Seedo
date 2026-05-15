'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GrassIcon from '@mui/icons-material/Grass'; // For Harvest
import PersonIcon from '@mui/icons-material/Person';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const farmerNavItems = [
  { title: 'Dashboard', path: '/farmer', icon: <DashboardIcon /> },
  { title: 'Find Agents', path: '/discovery', icon: <ExploreIcon /> },
  { title: 'Harvest Notices', path: '/farmer/harvest', icon: <GrassIcon /> },
  { title: 'Loans', path: '/farmer/loans', icon: <AccountBalanceIcon /> },
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
