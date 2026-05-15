import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AgentDashboardView from './AgentDashboardView';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export default async function AgentDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  let collections: any[] = [];
  let agents: any[] = [];
  let fetchError: string | null = null;

  try {
    const [colRes, agentsRes] = await Promise.all([
      fetch(`${API_BASE}/api/collections`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/agents`, { cache: 'no-store' }),
    ]);

    if (!colRes.ok) throw new Error(`Collections: ${colRes.status}`);
    if (!agentsRes.ok) throw new Error(`Agents: ${agentsRes.status}`);

    collections = await colRes.json();
    agents = await agentsRes.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load agent dashboard';
    console.error(`[AGENT PAGE] ${msg}`);
    fetchError = msg;
  }

  const agent = agents[0] || { id: '', name: 'Agent', role: 'AGENT', email: '', phone: '', provider: 'custom' as const };
  const totalCollections = agent.totalCollections || collections.length;
  const commissionEarned = totalCollections * 500;
  const tier = totalCollections > 100 ? 3 : totalCollections > 50 ? 2 : 1;

  const profile = {
    totalCollections,
    rating: agent.rating || 4.5,
    commissionEarned,
    tier,
  };

  return (
    <AgentDashboardView
      agent={agent}
      profile={profile}
      collections={collections}
      fetchError={fetchError}
    />
  );
}
