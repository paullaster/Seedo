import { NextResponse } from 'next/server';
import { bffPost, BffError } from '@/app/lib/bff';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await bffPost('/auth/admin-create-user', body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
