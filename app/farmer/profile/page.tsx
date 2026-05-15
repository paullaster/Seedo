import { Alert, Box } from '@mui/material';
import { bffGet } from '@/app/lib/bff';
import FarmerProfileView from './FarmerProfileView';

export const dynamic = 'force-dynamic';

const FARMER_ID = 'F001';

export default async function FarmerProfilePage() {
  let profile: any = null;
  let fetchError: string | null = null;

  try {
    const data = await bffGet<any>(`/users/${FARMER_ID}`);
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

  const emailVerified = profile.is_email_verified ? 'verified' as const : 'pending' as const;
  const phoneVerified = profile.is_phone_verified ? 'verified' as const : 'pending' as const;
  const nationalIdVerified = profile.verification_status === 'VERIFIED' ? 'verified' as const : 'pending' as const;

  const completionFields = [emailVerified, phoneVerified, nationalIdVerified].filter(v => v === 'verified').length;
  const completionPercentage = Math.round((completionFields / 3) * 100);

  const farmerProfile = {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email || 'Farmer',
    role: 'FARMER' as const,
    email: profile.email || '',
    phone: profile.phone_number || '',
    nationalId: profile.national_id || '',
    provider: 'custom' as const,
    farmName: '',
    produceType: [] as string[],
    avatarUrl: undefined as string | undefined,
    location: {
      lat: profile.location_lat || 0,
      lng: profile.location_lng || 0,
      address: profile.location_address || '',
    },
    verificationStatus: {
      email: emailVerified,
      phone: phoneVerified,
      nationalId: nationalIdVerified,
    },
    completionPercentage,
  };

  return <FarmerProfileView initialProfile={farmerProfile} />;
}
