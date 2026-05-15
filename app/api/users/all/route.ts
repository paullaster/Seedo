import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';

export async function GET() {
  try {
    const result = await bffGet('/users/all', { limit: '200', sortBy: 'created_at', sortOrder: 'desc' });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
