import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FarmerDashboardView from './FarmerDashboardView';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export default async function FarmerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  let collections: any[] = [];
  let marketRates: any[] = [];
  let agents: any[] = [];
  let weather: any = null;
  let fetchError: string | null = null;

  try {
    const [colRes, ratesRes, agentsRes, weatherRes] = await Promise.all([
      fetch(`${API_BASE}/api/collections`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/market-rates`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/agents`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/weather`, { cache: 'no-store' }),
    ]);

    if (!colRes.ok) throw new Error(`Collections: ${colRes.status}`);
    if (!ratesRes.ok) throw new Error(`Market rates: ${ratesRes.status}`);
    if (!agentsRes.ok) throw new Error(`Agents: ${agentsRes.status}`);

    collections = await colRes.json();
    marketRates = await ratesRes.json();
    agents = await agentsRes.json();

    if (weatherRes.ok) {
      weather = await weatherRes.json();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load dashboard data';
    console.error(`[FARMER PAGE] ${msg}`);
    fetchError = msg;
  }

  if (!weather) {
    weather = { temp: 24, condition: 'Cloudy', humidity: 65, forecast: 'Light showers expected later.' };
  }

  return (
    <FarmerDashboardView
      collections={collections}
      marketRates={marketRates}
      weather={weather}
      agents={agents}
      fetchError={fetchError}
    />
  );
}
