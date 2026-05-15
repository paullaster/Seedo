'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PermissionProvider } from '@/app/lib/permission-context';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ConstructionIcon from '@mui/icons-material/Construction';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';

const adminNavItems = [
  { title: 'Command Center', path: '/admin', icon: <DashboardIcon /> },
  { title: 'Markets & Pricing', path: '/admin/markets', icon: <ShowChartIcon /> },
  { title: 'Financial Control', path: '/admin/financials', icon: <AccountBalanceIcon /> },
  { title: 'Loan Portfolio', path: '/admin/loans', icon: <AccountBalanceWalletIcon /> },
  { title: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
  { title: 'Operations Center', path: '/admin/operations', icon: <ConstructionIcon /> },
  { title: 'Wastage Tracker', path: '/admin/wastage', icon: <WarningIcon /> },
  { title: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionProvider>
      <DashboardLayout navItems={adminNavItems} role="ADMIN">
        {children}
      </DashboardLayout>
    </PermissionProvider>
  );
}
