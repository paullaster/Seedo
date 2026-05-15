import { NextResponse } from 'next/server';
import { bffPost } from '@/app/lib/bff';
import { handleApiError } from '@/app/lib/api-error';

export async function POST(request: Request) {
  try {
    const { identity } = await request.json();

    if (!identity || typeof identity !== 'string' || identity.length < 3) {
      return NextResponse.json(
        { error: 'Invalid identity. Must be an email or phone number.' },
        { status: 400 },
      );
    }

    const result = await bffPost('/otp/send', { identity });
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}
