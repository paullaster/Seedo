import { NextResponse } from 'next/server';
import { bffAuthGet, bffAuthDelete, BffError } from '@/app/lib/bff';
import { auth } from '@/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const session = await auth();
    const accessToken = (session?.user as any)?.accessToken;
    const refreshToken = (session?.user as any)?.refreshToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, tokens } = await bffAuthGet(`/permissions/user/${userId}`, {
      accessToken,
      refreshToken,
    });

    const body: any = { data };

    if (tokens) {
      body.refreshedTokens = tokens;
    }

    return NextResponse.json(body);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const session = await auth();
    const accessToken = (session?.user as any)?.accessToken;
    const refreshToken = (session?.user as any)?.refreshToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const url = new URL(request.url);
    const permissionId = url.searchParams.get('permissionId');
    if (!permissionId) {
      return NextResponse.json({ error: 'permissionId query param required' }, { status: 400 });
    }

    const { tokens } = await bffAuthDelete(
      `/permissions/user/${userId}/permission/${permissionId}`,
      { accessToken, refreshToken },
    );

    const body: any = { success: true };

    if (tokens) {
      body.refreshedTokens = tokens;
    }

    return NextResponse.json(body);
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
