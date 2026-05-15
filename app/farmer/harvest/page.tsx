import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import HarvestPageView from './HarvestPageView';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export default async function FarmerHarvestPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  let notices: any[] = [];
  let rates: any[] = [];
  let fetchError: string | null = null;

  try {
    const [noticesRes, ratesRes] = await Promise.all([
      fetch(`${API_BASE}/api/harvest-notices`, { cache: 'no-store' }),
      fetch(`${API_BASE}/api/market-rates`, { cache: 'no-store' }),
    ]);

    if (!noticesRes.ok) throw new Error(`Harvest notices: ${noticesRes.status}`);
    if (!ratesRes.ok) throw new Error(`Market rates: ${ratesRes.status}`);

    notices = await noticesRes.json();
    rates = await ratesRes.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load harvest page';
    console.error(`[HARVEST PAGE] ${msg}`);
    fetchError = msg;
  }

  return <HarvestPageView initialNotices={notices} marketRates={rates} fetchError={fetchError} />;
}
