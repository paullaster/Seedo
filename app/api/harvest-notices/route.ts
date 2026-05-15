import { NextResponse } from 'next/server';
import { bffGet, bffPost, BffError } from '@/app/lib/bff';
import type { HarvestNotice } from '@/app/lib/types';

function translateBackendToFrontend(item: any): HarvestNotice {
  const produceName = item.produce_harvest_notices_produceToproduce?.name || item.produce || 'Unknown';
  return {
    id: item.id,
    farmerId: item.farmer_id || '',
    produceType: produceName,
    estimatedWeightKg: item.estimated_quatity || 0,
    readyDate: item.ready_date?.split('T')[0] || item.created_at?.split('T')[0] || '',
    status: item.status || 'OPEN',
  };
}

function translateFrontendToBackend(notice: Record<string, unknown>) {
  return {
    produce: (notice.produceType as string) || 'Unknown',
    estimatedQuantity: Math.round((notice.estimatedWeightKg as number) || 0),
    unitOfMeasurement: (notice.unitOfMeasurement as string) || '',
    farmerId: (notice.farmerId as string) || undefined,
    readyDate: (notice.readyDate as string) || undefined,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId') || undefined;
    const data = await bffGet<any[]>('/harvest', farmerId ? { farmerId } : undefined);
    const notices = (Array.isArray(data) ? data : []).map(translateBackendToFrontend);
    return NextResponse.json(notices);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = translateFrontendToBackend(body);
    const result = await bffPost('/harvest', payload);
    return NextResponse.json(translateBackendToFrontend(result), { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
