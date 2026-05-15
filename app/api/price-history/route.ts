import { NextResponse } from 'next/server';
import { bffGet, BffError } from '@/app/lib/bff';
import type { PriceHistory } from '@/app/lib/types';

function translateBackendToFrontend(item: any): PriceHistory {
  return {
    date: item.date ? item.date.split('T')[0] : '',
    price: Number(item.price),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const produceType = searchParams.get('produceType');

    const data = await bffGet<any[]>('/price-history');
    let records = (Array.isArray(data) ? data : []).map(translateBackendToFrontend);

    if (produceType) {
      records = records.filter((_, i) => {
        const item = (data as any[])[i];
        return item.produce?.name === produceType;
      });
    }

    return NextResponse.json(records);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
