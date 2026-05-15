import { Alert, Box } from '@mui/material';
import { bffGet } from '@/app/lib/bff';
import AgentProfileView from './AgentProfileView';

export const dynamic = 'force-dynamic';

const AGENT_ID = 'A001';

export default async function AgentProfilePage() {
  let profile: any = null;
  let fetchError: string | null = null;

  try {
    const data = await bffGet<any>(`/users/${AGENT_ID}`);
    profile = data;
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Failed to load profile';
  }

  if (fetchError || !profile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{fetchError || 'Profile not found'}</Alert>
      </Box>
    );
  }

  const agentProfile = {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Agent',
    role: 'AGENT' as const,
    agentType: (profile.role === 'AGENT_STORE' ? 'STORE' : 'COLLECTION') as 'STORE' | 'COLLECTION',
    email: profile.email || '',
    phone: profile.phone_number || '',
    provider: 'custom' as const,
    region: profile.region || '',
    active: profile.is_active ?? true,
    totalCollections: profile.total_collections || 0,
    rating: profile.rating || 0,
    location: {
      lat: profile.location_lat || 0,
      lng: profile.location_lng || 0,
      address: profile.location_address || '',
    },
    isVetted: profile.verification_status === 'VERIFIED',
    isVerified: profile.is_email_verified && profile.is_phone_verified,
    verificationStatus: {
      email: profile.is_email_verified ? 'verified' as const : 'pending' as const,
      phone: profile.is_phone_verified ? 'verified' as const : 'pending' as const,
    },
    commissionEarned: (profile.total_collections || 0) * 500,
    tier: ((profile.total_collections || 0) > 100 ? 3 : (profile.total_collections || 0) > 50 ? 2 : 1) as 1 | 2 | 3,
  };

  return <AgentProfileView initialProfile={agentProfile} />;
}
