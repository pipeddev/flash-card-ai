import { env } from '../../app/config/env';
import type { JSendResponse } from './jsend';

export class JSendFailError extends Error {
  data: unknown;

  constructor(data: unknown) {
    super('Request failed (JSend: fail)');
    this.name = 'JSendFailError';
    this.data = data;
  }
}

export class JSendServerError extends Error {
  code?: number;
  data?: unknown;

  constructor(message: string, code?: number, data?: unknown) {
    super(message);
    this.name = 'JSendServerError';
    this.code = code;
    this.data = data;
  }
}

export class HttpClient {
  baseUrl: string;
  constructor(baseUrl: string = env.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });

    const text = await response.text();

    let json: JSendResponse<T>;
    try {
      json = text
        ? (JSON.parse(text) as JSendResponse<T>)
        : ({} as JSendResponse<T>);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }

    switch (json.status) {
      case 'success':
        return json.data;

      case 'fail':
        throw new JSendFailError(json.data);

      case 'error':
        throw new JSendServerError(json.message, json.code, json.data);

      default:
        throw new Error(
          `Unknown JSend status: ${(json as { status?: string }).status}`
        );
    }
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: 'GET' });
  }

  post<T, B>(path: string, body: B) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T, B>(path: string, body: B) {
    return this.request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
