import { NextResponse } from 'next/server';
import { bffGet, bffPost, BffError } from '@/app/lib/bff';
import type { ProduceCollection } from '@/app/lib/types';

function translateBackendToFrontend(item: any): ProduceCollection {
  const produceName = item.produce?.name || 'Unknown';
  return {
    id: item.id,
    farmerId: item.farmer_id,
    agentId: item.agent_id,
    collectionAgentId: item.collection_agent_id,
    produceType: produceName,
    grade: item.grade || 'A',
    weightKg: Number(item.weight_kg),
    pricePerKg: Number(item.price_per_kg),
    totalAmount: Number(item.total_amount),
    status: item.status,
    timestamp: item.timestamp || item.created_at,
    verifiedAt: item.verified_at,
    imageUrl: item.image_url,
    location: { lat: item.location_lat || 0, lng: item.location_lng || 0 },
    disputeReason: item.dispute_reason,
  };
}

function translateFrontendToBackend(collection: Record<string, unknown>) {
  return {
    farmer_id: collection.farmerId,
    agent_id: collection.agentId,
    collection_agent_id: collection.collectionAgentId,
    produce_id: collection.produceId || collection.produceType,
    grade: collection.grade || 'A',
    weight_kg: Number(collection.weightKg || 0),
    price_per_kg: Number(collection.pricePerKg || 0),
    image_url: collection.imageUrl,
    location_lat: (collection.location as any)?.lat,
    location_lng: (collection.location as any)?.lng,
    dispute_reason: collection.disputeReason,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    const farmerId = searchParams.get('farmerId');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');

    if (farmerId) params.farmerId = farmerId;
    if (status) params.status = status;
    if (agentId) params.agentId = agentId;

    const data = await bffGet<any[]>('/collections', params);
    const collections = (Array.isArray(data) ? data : []).map(translateBackendToFrontend);
    return NextResponse.json(collections);
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
    const result = await bffPost('/collections', payload);
    return NextResponse.json(translateBackendToFrontend(result), { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
