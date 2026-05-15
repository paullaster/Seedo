import { NextResponse } from 'next/server';
import { BffError } from './bff';

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof BffError) {
    console.error(`[BFF] ${err.context || ''} → ${err.statusCode}: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: err.statusCode });
  }
  const status = 500;
  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error(`[API] Unhandled error: ${message}`);
  return NextResponse.json({ error: message }, { status });
}
