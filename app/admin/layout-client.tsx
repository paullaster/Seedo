'use client';
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People'; // Farmers & Agents
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DeleteIcon from '@mui/icons-material/Delete'; // Wastage
import SettingsIcon from '@mui/icons-material/Settings';

const adminNavItems = [
  { title: 'Overview', path: '/admin', icon: <DashboardIcon /> },
  { title: 'User Management', path: '/admin/users', icon: <PeopleIcon /> },
  { title: 'Financials', path: '/admin/financials', icon: <AnalyticsIcon /> },
  { title: 'Wastage Tracker', path: '/admin/wastage', icon: <DeleteIcon /> },
  { title: 'Settings', path: '/admin/settings', icon: <SettingsIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={adminNavItems} role="ADMIN">
      {children}
    </DashboardLayout>
  );
}
