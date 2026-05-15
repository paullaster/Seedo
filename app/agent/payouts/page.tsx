import { Alert, Box } from '@mui/material';
import { bffGet, BffError } from '@/app/lib/bff';
import PayoutsView from './PayoutsView';

export const dynamic = 'force-dynamic';

const AGENT_ID = 'A001';

export default async function AgentPayoutsPage() {
  let collections: any[] = [];
  let profile: any = null;
  let fetchError: string | null = null;

  try {
    const [colData, profileData] = await Promise.all([
      bffGet<any[]>('/collections', { status: 'VERIFIED,PAID', agentId: AGENT_ID }).catch(() => []),
      bffGet<any>(`/users/${AGENT_ID}`).catch(() => null),
    ]);
    collections = Array.isArray(colData) ? colData : [];
    profile = profileData;
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Failed to load data';
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{fetchError}</Alert>
      </Box>
    );
  }

  const commissionEarned = profile?.total_collections
    ? Number(profile.total_collections) * 500
    : collections.length * 500;
  const totalCollections = profile?.total_collections || collections.length;
  const tier = totalCollections > 100 ? 3 : totalCollections > 50 ? 2 : 1;

  return (
    <PayoutsView
      collections={collections}
      commissionEarned={commissionEarned}
      totalCollections={totalCollections}
      tier={tier}
      agentId={AGENT_ID}
    />
  );
}
