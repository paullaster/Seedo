import { NextResponse } from 'next/server';
import { bffPatch, bffDelete, BffError } from '@/app/lib/bff';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload: Record<string, unknown> = {};
    if (body.produceType) payload.name = body.produceType;
    if (body.pricePerKg !== undefined) payload.rate = body.pricePerKg;
    if (body.trend) payload.trend = body.trend;
    if (body.category) payload.category = body.category;
    if (body.estimatedRequireQuantity !== undefined)
      payload.estimated_require_quantity = body.estimatedRequireQuantity;

    await bffPatch(`/produce/${id}`, payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await bffDelete(`/produce/${id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
