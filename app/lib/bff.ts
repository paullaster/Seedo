import { auth } from "@/auth";

const NESTJS_URL = process.env.NESTJS_URL || 'http://127.0.0.1:3900';
const API_V1 = `${NESTJS_URL}/api/v1`;

export class BffError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public context?: string,
  ) {
    super(message);
    this.name = 'BffError';
  }
}

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

async function backendFetch(path: string, options?: RequestInit) {
  const url = `${API_V1}${path}`;
  const context = `${options?.method || 'GET'} ${url}`;

  const session = await auth();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.accessToken}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const msg = `Backend ${res.status} on ${path}: ${body.slice(0, 200)}`;
      console.error(`[BFF] ${context} → ${res.status}: ${body.slice(0, 500)}`);
      throw new BffError(msg, res.status, context);
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return res.json();
    }
    return null;
  } catch (err) {
    if (err instanceof BffError) throw err;

    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[BFF] ${context} → NETWORK ERROR: ${msg}`);
    throw new BffError(
      `Cannot reach backend service at ${NESTJS_URL}. Is it running?`,
      503,
      context,
    );
  }
}

async function backendAuthFetch(
  path: string,
  tokens: AuthTokens,
  options?: RequestInit,
): Promise<any> {
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${API_V1}${path}`;
  const context = `${options?.method || 'GET'} ${url}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(options?.headers as Record<string, string>),
      },
    });

    if (res.status === 401 && refreshToken) {
      console.log(`[BFF] 401 on ${path} — attempting refresh`);
      const refreshRes = await fetch(`${API_V1}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        const newAccessToken: string = refreshed.accessToken;
        const newRefreshToken: string = refreshed.refreshToken;

        console.log(`[BFF] Token refresh successful — retrying ${path}`);

        const retryRes = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
            ...(options?.headers as Record<string, string>),
          },
        });

        if (!retryRes.ok) {
          const body = await retryRes.text().catch(() => '');
          throw new BffError(
            `Backend ${retryRes.status} on ${path} (after refresh): ${body.slice(0, 200)}`,
            retryRes.status,
            context,
          );
        }

        const data = await retryRes.json().catch(() => null);

        return {
          _tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
          _data: data,
        };
      } else {
        const body = await refreshRes.text().catch(() => '');
        console.error(`[BFF] Token refresh failed: ${refreshRes.status} ${body.slice(0, 200)}`);
        throw new BffError(`Session expired. Please login again.`, 401, context);
      }
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const msg = `Backend ${res.status} on ${path}: ${body.slice(0, 200)}`;
      console.error(`[BFF] ${context} → ${res.status}: ${body.slice(0, 500)}`);
      throw new BffError(msg, res.status, context);
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return res.json();
    }
    return null;
  } catch (err) {
    if (err instanceof BffError) throw err;

    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[BFF] ${context} → NETWORK ERROR: ${msg}`);
    throw new BffError(
      `Cannot reach backend service at ${NESTJS_URL}. Is it running?`,
      503,
      context,
    );
  }
}

export async function bffGet<T = any>(path: string, params?: Record<string, string>, options?: Record<string, unknown>): Promise<T> {
  const search = params ? '?' + new URLSearchParams(params).toString() : '';
  return backendFetch(`${path}${search}`, options);
}

export async function bffPost<T = any>(path: string, body?: unknown): Promise<T> {
  return backendFetch(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function bffPatch<T = any>(path: string, body?: unknown): Promise<T> {
  return backendFetch(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function bffDelete(path: string): Promise<void> {
  await backendFetch(path, { method: 'DELETE' });
}

export async function bffAuthGet<T = any>(
  path: string,
  tokens: AuthTokens,
  params?: Record<string, string>,
): Promise<{ data: T; tokens?: { accessToken: string; refreshToken: string } }> {
  const search = params ? '?' + new URLSearchParams(params).toString() : '';
  const result = await backendAuthFetch(`${path}${search}`, tokens);
  if (result && result._tokens) {
    return { data: result._data as T, tokens: result._tokens };
  }
  return { data: result as T };
}

export async function bffAuthPost<T = any>(
  path: string,
  tokens: AuthTokens,
  body?: unknown,
): Promise<{ data: T; tokens?: { accessToken: string; refreshToken: string } }> {
  const result = await backendAuthFetch(path, tokens, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (result && result._tokens) {
    return { data: result._data as T, tokens: result._tokens };
  }
  return { data: result as T };
}

export async function bffAuthDelete(
  path: string,
  tokens: AuthTokens,
): Promise<{ tokens?: { accessToken: string; refreshToken: string } }> {
  const result = await backendAuthFetch(path, tokens, { method: 'DELETE' });
  if (result && result._tokens) {
    return { tokens: result._tokens };
  }
  return {};
}
