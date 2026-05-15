import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';

function translateBackendToFrontend(item: any) {
  return {
    storeId: item.store_id,
    produceType: item.produce?.name || item.produce_id || 'Unknown',
    intakeWeight: Number(item.intake_weight),
    warehouseWeight: Number(item.warehouse_weight),
    shrinkagePercentage: Number(item.shrinkage_percentage),
    timestamp: item.timestamp || item.created_at,
  };
}

export async function GET() {
  try {
    const data = await bffGet<any[]>('/wastage');
    const records = (Array.isArray(data) ? data : []).map(translateBackendToFrontend);
    return NextResponse.json(records);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
