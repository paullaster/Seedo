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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const adminNavItems = [
  { title: 'Command Center', path: '/admin', icon: <DashboardIcon /> },
  { title: 'Markets & Pricing', path: '/admin/markets', icon: <ShowChartIcon /> },
  { title: 'Financial Control', path: '/admin/financials', icon: <AccountBalanceIcon /> },
  { title: 'Loan Portfolio', path: '/admin/loans', icon: <AccountBalanceWalletIcon /> },
  { title: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
  { title: 'Operations Center', path: '/admin/operations', icon: <ConstructionIcon /> },
  { title: 'Wastage Tracker', path: '/admin/wastage', icon: <WarningIcon /> },
  { title: 'System Settings', path: '/admin/settings', icon: <SettingsIcon /> },
  { title: 'Pickup Requests', path: '/admin/pickup-requests', icon: <LocalShippingIcon /> },
  { title: 'Warehouses', path: '/admin/warehouses', icon: <WarehouseIcon /> },
  { title: 'Batches', path: '/admin/batches', icon: <InventoryIcon /> },
  { title: 'Delivery Notes', path: '/admin/delivery-notes', icon: <DescriptionIcon /> },
  { title: 'Number Series', path: '/admin/number-series', icon: <FormatListNumberedIcon /> },
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
