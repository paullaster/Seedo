import { NextResponse } from 'next/server';
import { bffGet, bffPost, BffError } from '@/app/lib/bff';
import type { Loan } from '@/app/lib/types';

function translateBackendToFrontend(item: any): Loan {
  const recoveries = (item.loan_recoveries || []).map((r: any) => ({
    collectionId: r.collection_id,
    amountRecovered: Number(r.amount_recovered),
    timestamp: r.timestamp,
  }));
  return {
    id: item.id,
    farmerId: item.farmer_id,
    orderId: item.order_id,
    principalAmount: Number(item.principal_amount),
    remainingBalance: Number(item.remaining_balance),
    status: item.status,
    timestamp: item.timestamp || item.created_at,
    expectedRecoveryDate: item.expected_recovery_date,
    recoveryHistory: recoveries,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get('farmerId');
    const params: Record<string, string> = {};
    if (farmerId) params.farmerId = farmerId;
    const data = await bffGet<any[]>('/loans', params);
    const loans = (Array.isArray(data) ? data : []).map(translateBackendToFrontend);
    return NextResponse.json(loans);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await bffPost('/loans', {
      farmer_id: body.farmerId,
      order_id: body.orderId,
      principal_amount: Number(body.principalAmount || 0),
      remaining_balance: Number(body.remainingBalance || body.principalAmount || 0),
      expected_recovery_date: body.expectedRecoveryDate,
    });
    return NextResponse.json(translateBackendToFrontend(result), { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
