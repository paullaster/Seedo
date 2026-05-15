import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const result = await bffGet(`/auth/verify-token/${encodeURIComponent(token)}`);
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
