const API_BASE = '/api/v1/';
const TOKEN_KEY = 'task-orders.token';

export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = tokenStorage.get();

  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const url = `${API_BASE}${path.replace(/^\/+/, '')}`;

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await extractErrorMessage(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    if (body.message) return body.message;
  } catch {
    // no json body
  }
  return response.statusText || `Request failed with status ${response.status}`;
}

export interface EnvelopeData<T> {
  status: string;
  message?: string;
  data?: T;
}

/** Для ответов вида `{ status, data: T }` — возвращает только data. */
export async function requestData<T>(path: string, options?: RequestOptions): Promise<T> {
  const envelope = await request<EnvelopeData<T>>(path, options);
  if (envelope.data === undefined) {
    throw new ApiError(500, 'Некорректный формат ответа сервера');
  }
  return envelope.data;
}
