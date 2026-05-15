import { NextResponse } from 'next/server';
import { bffPatch, BffError } from '@/app/lib/bff';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const payload: Record<string, unknown> = {};
    if (data.status) payload.status = data.status;
    if (data.remainingBalance !== undefined) payload.remaining_balance = data.remainingBalance;

    await bffPatch(`/loans/${id}`, payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
