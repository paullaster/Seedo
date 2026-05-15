import React from 'react';
import { apiService } from '@/app/lib/api-service';
import DiscoveryClient from './components/DiscoveryClient';

export const dynamic = 'force-dynamic';

export default async function DiscoveryPage() {
  // In a real app, we would fetch based on IP/Region
  const allAgents = await apiService.getAgents();
  const verifiedAgents = allAgents.filter(a => a.isVerified);

  return (
    <DiscoveryClient initialAgents={verifiedAgents} />
  );
}
