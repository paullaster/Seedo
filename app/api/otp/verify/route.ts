import { NextResponse } from 'next/server';
import { bffPost } from '@/app/lib/bff';
import { handleApiError } from '@/app/lib/api-error';

export async function POST(request: Request) {
  try {
    const { identity, code } = await request.json();

    if (!identity || typeof identity !== 'string') {
      return NextResponse.json({ error: 'Invalid identity' }, { status: 400 });
    }
    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code. Must be a 6-digit number.' },
        { status: 400 },
      );
    }

    const result = await bffPost('/otp/verify', { identity, code });
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}
