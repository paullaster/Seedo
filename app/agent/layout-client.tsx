'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExploreIcon from '@mui/icons-material/Explore';

const agentNavItems = [
  { title: 'Dashboard', path: '/agent', icon: <DashboardIcon /> },
  { title: 'Find Agents', path: '/discovery', icon: <ExploreIcon /> },
  { title: 'Produce Intake', path: '/agent/collection', icon: <QrCodeScannerIcon /> },
  { title: 'Audit & Verification', path: '/agent/verification', icon: <VerifiedUserIcon /> },
  { title: 'Store Inventory', path: '/agent/inventory', icon: <InventoryIcon /> },
  { title: 'Earnings', path: '/agent/payouts', icon: <MonetizationOnIcon /> },
  { title: 'Agent Identity', path: '/agent/profile', icon: <PersonIcon /> },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={agentNavItems} role="AGENT">
      {children}
    </DashboardLayout>
  );
}
