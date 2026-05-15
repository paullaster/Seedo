import { NextResponse } from 'next/server';
import { bffGet, bffPost, BffError } from '@/app/lib/bff';
import type { MarketRate } from '@/app/lib/types';

function translateProduceToMarketRate(item: any): MarketRate {
  return {
    id: item.id,
    produceType: item.name,
    pricePerKg: Number(item.rate),
    trend: item.trend || 'STABLE',
    category: item.category || undefined,
    estimatedRequireQuantity: item.estimated_require_quantity ?? undefined,
    lastUpdated: item.created_at || new Date().toISOString(),
  };
}

function translateMarketRateToProduce(rate: Record<string, unknown>) {
  const body: Record<string, unknown> = {};
  if (rate.produceType) body.name = rate.produceType;
  if (rate.pricePerKg !== undefined) body.rate = rate.pricePerKg;
  if (rate.trend) body.trend = rate.trend;
  if (rate.category) body.category = rate.category;
  if (rate.estimatedRequireQuantity !== undefined)
    body.estimated_require_quantity = rate.estimatedRequireQuantity;
  return body;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const qs = new URLSearchParams(params).toString();
    const result = await bffGet<any>(`/produce${qs ? `?${qs}` : ''}`);
    const items = result.data || result || [];
    const rates = (Array.isArray(items) ? items : []).map(translateProduceToMarketRate);
    return NextResponse.json(rates);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = translateMarketRateToProduce(body);
    const result = await bffPost('/produce', payload);
    return NextResponse.json(translateProduceToMarketRate(result), { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
