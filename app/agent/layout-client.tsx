'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'; // Collection
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Payments
import PersonIcon from '@mui/icons-material/Person';

const agentNavItems = [
  { title: 'Dashboard', path: '/agent', icon: <DashboardIcon /> },
  { title: 'New Collection', path: '/agent/collection', icon: <QrCodeScannerIcon /> },
  { title: 'Inventory', path: '/agent/inventory', icon: <InventoryIcon /> },
  { title: 'Payouts', path: '/agent/payouts', icon: <MonetizationOnIcon /> },
  { title: 'Profile', path: '/agent/profile', icon: <PersonIcon /> },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={agentNavItems} role="AGENT">
      {children}
    </DashboardLayout>
  );
}
