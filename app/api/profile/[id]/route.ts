import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await bffGet<any>(`/users/${id}`);

    const profile = {
      id: data.id,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email || 'Unknown',
      email: data.email || '',
      phone: data.phone_number || '',
      nationalId: data.national_id || '',
      role: data.role || 'FARMER',
      region: data.region || '',
      isActive: data.is_active ?? true,
      totalCollections: data.total_collections || 0,
      rating: data.rating || 0,
      verificationStatus: {
        email: data.is_email_verified ? 'verified' : 'pending',
        phone: data.is_phone_verified ? 'verified' : 'pending',
        nationalId: data.verification_status === 'VERIFIED' ? 'verified' : 'pending',
      },
      location: {
        lat: data.location_lat || 0,
        lng: data.location_lng || 0,
        address: data.location_address || '',
      },
      isVetted: data.verification_status === 'VERIFIED',
      isVerified: data.is_email_verified && data.is_phone_verified,
    };

    return NextResponse.json(profile);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
