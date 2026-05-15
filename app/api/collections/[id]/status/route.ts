import { NextResponse } from 'next/server';
import { bffPatch, BffError } from '@/app/lib/bff';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    await bffPatch(`/collections/${id}/status`, { status });
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
