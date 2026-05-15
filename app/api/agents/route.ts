import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';
import type { Agent } from '@/app/lib/types';

function translateUserToAgent(user: any): Agent {
  return {
    id: user.id,
    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown',
    role: 'AGENT',
    email: user.email || '',
    phone: user.phone_number || '',
    agentType: user.role === 'AGENT_STORE' ? 'STORE' : 'COLLECTION',
    region: user.region || '',
    active: user.is_active ?? true,
    totalCollections: user.total_collections || 0,
    rating: user.rating || 0,
    provider: 'custom',
    location: {
      lat: user.location_lat || 0,
      lng: user.location_lng || 0,
      address: user.location_address || '',
    },
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const type = searchParams.get('type');

    const result = await bffGet<any>('/users/all');
    const users = result.data || result || [];
    let agents = (Array.isArray(users) ? users : [])
      .filter((u: any) => u.role === 'AGENT_COLLECTION' || u.role === 'AGENT_STORE')
      .map(translateUserToAgent);

    if (region) {
      agents = agents.filter((a: Agent) => a.region?.toLowerCase().includes(region.toLowerCase()));
    }
    if (type) {
      agents = agents.filter((a: Agent) => a.agentType === type);
    }

    return NextResponse.json(agents);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
