import { NextResponse } from 'next/server';
import { bffAuthPost, BffError } from '@/app/lib/bff';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const accessToken = (session?.user as any)?.accessToken;
    const refreshToken = (session?.user as any)?.refreshToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { data, tokens } = await bffAuthPost('/auth/admin-create-user', {
      accessToken,
      refreshToken,
    }, body);

    const result: any = data;

    if (tokens) {
      result.refreshedTokens = tokens;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const status = err instanceof BffError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status });
  }
}
