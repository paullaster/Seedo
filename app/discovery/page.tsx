import React, { Suspense } from 'react';
import type { Agent } from '@/app/lib/types';
import { bffGet } from '@/app/lib/bff';
import DiscoveryClient from './components/DiscoveryClient';
import DiscoveryLoading from './loading';

async function fetchAgents(): Promise<Agent[]> {
  const data = await bffGet<any>('/users/all', { limit: '100' });
  const users = data.data || data;
  return users
    .filter((u: any) => u.role === 'AGENT_COLLECTION' || u.role === 'AGENT_STORE')
    .map((u: any) => ({
      id: u.id,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      role: 'AGENT' as const,
      email: u.email,
      phone: u.phone_number,
      provider: u.auth_provider === 'google' ? 'google' as const : 'custom' as const,
      agentType: (u.role === 'AGENT_STORE' ? 'STORE' : 'COLLECTION') as 'STORE' | 'COLLECTION',
      region: u.region || '',
      active: u.is_active ?? true,
      totalCollections: u.total_collections || 0,
      rating: u.rating || 0,
      isVetted: u.verification_status === 'VERIFIED',
      isVerified: u.verification_status === 'VERIFIED',
      location: {
        lat: u.location_lat || 0,
        lng: u.location_lng || 0,
        address: u.location_address || '',
      },
      acceptedProduce: [],
      nationalId: u.national_id,
    }));
}

async function fetchProduce(): Promise<string[]> {
  const data = await bffGet<any>('/produce', { limit: '50' });
  const items = data.data || data;
  return (Array.isArray(items) ? items : []).map((p: any) => p.name);
}

export default function DiscoveryPage() {
  const agentsPromise = fetchAgents();
  const producePromise = fetchProduce();

  return (
    <Suspense fallback={<DiscoveryLoading />}>
      <DiscoveryClient agentsPromise={agentsPromise} producePromise={producePromise} />
    </Suspense>
  );
}
