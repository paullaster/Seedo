export const NESTJS_URL = process.env.NESTJS_URL || 'http://127.0.0.1:3900';
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

async function backendFetch(path: string, options?: RequestInit) {
  const url = `${API_V1}${path}`;
  const context = `${options?.method || 'GET'} ${url}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

export async function bffGet<T = any>(path: string, params?: Record<string, string>): Promise<T> {
  const search = params ? '?' + new URLSearchParams(params).toString() : '';
  return backendFetch(`${path}${search}`);
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
