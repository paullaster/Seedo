import { NextResponse } from 'next/server';
import { bffGet, bffDelete, BffError } from '@/app/lib/bff';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const result = await bffGet(`/permissions/user/${userId}`);
    return NextResponse.json(result);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const url = new URL(request.url);
    const permissionId = url.searchParams.get('permissionId');
    if (!permissionId) {
      return NextResponse.json({ error: 'permissionId query param required' }, { status: 400 });
    }
    await bffDelete(`/permissions/user/${userId}/permission/${permissionId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
