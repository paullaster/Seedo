'use server';

import { bffGet, bffPost, bffPatch, bffDelete, BffError } from '@/app/lib/bff';
import type { MarketRate } from '@/app/lib/types';

interface Produce {
  id: string;
  name: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  category: string;
  rate: string;
  estimated_require_quantity?: number;
  created_at: string;
  updated_at?: string;
  unit_of_measurement: string;
}

function translateProduceToMarketRate(item: Produce): MarketRate {
  return {
    id: item.id,
    produceType: item.name,
    pricePerKg: Number(item.rate),
    trend: item.trend || 'STABLE',
    category: item.category || undefined,
    estimatedRequireQuantity: item.estimated_require_quantity ?? undefined,
    lastUpdated: item.updated_at || item.created_at || new Date().toISOString(),
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

export async function getMarketRates(search?: string): Promise<MarketRate[]> {
  try {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const qs = new URLSearchParams(params).toString();
    const result = await bffGet<any>(`/produce${qs ? `?${qs}` : ''}`);
    const items = result.data || result || [];
    return (Array.isArray(items) ? items : []).map(translateProduceToMarketRate);
  } catch (err) {
    throw err instanceof BffError ? err : new Error('Failed to fetch market rates');
  }
}

export async function createMarketRate(data: Record<string, unknown>): Promise<MarketRate> {
  try {
    const payload = translateMarketRateToProduce(data);
    const result = await bffPost('/produce', payload);
    return translateProduceToMarketRate(result);
  } catch (err) {
    throw err instanceof BffError ? err : new Error('Failed to create market rate');
  }
}

export async function updateMarketRate(id: string, data: Record<string, unknown>): Promise<void> {
  try {
    const payload: Record<string, unknown> = {};
    if (data.produceType) payload.name = data.produceType;
    if (data.pricePerKg !== undefined) payload.rate = data.pricePerKg;
    if (data.trend) payload.trend = data.trend;
    if (data.category) payload.category = data.category;
    if (data.estimatedRequireQuantity !== undefined)
      payload.estimated_require_quantity = data.estimatedRequireQuantity;

    await bffPatch(`/produce/${id}`, payload);
  } catch (err) {
    throw err instanceof BffError ? err : new Error('Failed to update market rate');
  }
}

export async function deleteMarketRate(id: string): Promise<void> {
  try {
    await bffDelete(`/produce/${id}`);
  } catch (err) {
    throw err instanceof BffError ? err : new Error('Failed to delete market rate');
  }
}
