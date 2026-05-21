import { NextResponse } from 'next/server';
import { bffPost, BffError } from '@/app/lib/bff';
import { handleApiError } from '@/app/lib/api-error';

function generatePassword(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields: email, phone' },
        { status: 400 },
      );
    }

    const authProvider: string = body.authProvider || 'custom';
    const autoPasswordProviders = ['google'];
    let password: string;

    if (!body.password) {
      if (autoPasswordProviders.includes(authProvider)) {
        password = generatePassword();
      } else {
        return NextResponse.json(
          { error: 'Password is required for this registration method' },
          { status: 400 },
        );
      }
    } else {
      password = body.password;
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const nameParts = (body.name || '').split(' ');
    const role: string = body.role || 'FARMER';
    const payload = {
      firstName: nameParts[0] || 'Farmer',
      lastName: nameParts.slice(1).join(' ') || 'User',
      email: body.email,
      phoneNumber: body.phone,
      nationalId: body.nationalId,
      password,
      role,
      authProvider,
      locationLat: body.location?.lat,
      locationLng: body.location?.lng,
      locationAddress: body.location?.address,
    };

    const result = await bffPost('/users/register', payload);

    const loginResult = await bffPost<{ accessToken: string; userId: string }>('/auth/login', {
      username: body.phone,
      password,
    });

    return NextResponse.json({
      user: {
        id: result.id,
        name: `${result.first_name} ${result.last_name}`,
        email: result.email,
        phone: result.phone_number,
        role: 'FARMER',
        nationalId: result.national_id,
        provider: authProvider,
        isComplete: true,
        location: {
          lat: result.location_lat || 0,
          lng: result.location_lng || 0,
          address: result.location_address || '',
        },
      },
      tokens: {
        accessToken: loginResult.accessToken,
        refreshToken: '',
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
    }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
