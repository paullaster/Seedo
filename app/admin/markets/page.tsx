import { getMarketRates } from './actions';
import type { MarketRate } from '@/app/lib/types';
import MarketsManagementView from './MarketsManagementView';

export default function MarketsManagementPage() {
  const ratesPromise = getMarketRates()
    .then(rates => ({ rates, error: null as string | null }))
    .catch(err => ({ rates: [] as MarketRate[], error: err instanceof Error ? err.message : 'Failed to load market rates' }));

  return <MarketsManagementView ratesPromise={ratesPromise} />;
}
