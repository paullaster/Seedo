import MarketsManagementView from './MarketsManagementView';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export default async function MarketsManagementPage() {
  let rates: any[] = [];
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${API_BASE}/api/market-rates`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Market rates: ${res.status}`);
    rates = await res.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load market rates';
    console.error(`[MARKETS PAGE] ${msg}`);
    fetchError = msg;
  }

  return <MarketsManagementView initialRates={rates} fetchError={fetchError} />;
}
