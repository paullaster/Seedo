import { NextResponse } from 'next/server';
import { bffPost, BffError } from '@/app/lib/bff';

export async function POST(request: Request) {
  try {
    const { ids, agentId } = await request.json();
    const result = await bffPost('/payouts/bulk', { collectionIds: ids, agentId });
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
