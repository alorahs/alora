import { API_CONFIG } from '@/shared/constants';
import { proxyApiRequest, proxyUploadRequest } from '@/lib/apiProxy';

export interface ApiValidationError {
  msg: string;
  param?: string;
  location?: string;
  value?: unknown;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
  errors?: ApiValidationError[];
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  details?: ApiErrorPayload;

  constructor(message: string, status: number, details?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

const DEFAULT_JSON_HEADERS = ['Content-Type', 'content-type'];

/**
 * Base API Service Class with proxy-aware fetch and rich error handling
 */
class ApiService {
  private readonly timeout: number;

  constructor() {
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private ensureJsonContentType(headers: Record<string, string>, body: unknown) {
    const shouldAddJsonHeader =
      body !== undefined &&
      body !== null &&
      !(body instanceof FormData) &&
      typeof body !== 'string' &&
      !DEFAULT_JSON_HEADERS.some((key) => key in headers);

    if (shouldAddJsonHeader) {
      headers['Content-Type'] = 'application/json';
    }
  }

  private extractErrorMessage(payload: unknown, response: Response): string {
    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const data = payload as ApiErrorPayload;
      if (typeof data.message === 'string' && data.message.trim().length > 0) {
        return data.message;
      }
      if (typeof data.error === 'string' && data.error.trim().length > 0) {
        return data.error;
      }
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const firstError = data.errors[0];
        if (firstError && typeof firstError.msg === 'string') {
          return firstError.msg;
        }
      }
    }

    return response.statusText || 'Request failed';
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const isEmpty = response.status === 204 || response.status === 205;

    if (isEmpty) {
      return undefined as T;
    }

    let payload: unknown = null;

    if (isJson) {
      try {
        payload = await response.json();
      } catch {
        if (response.ok) {
          throw new ApiError('Failed to parse JSON response', response.status);
        }
      }
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      const message = this.extractErrorMessage(payload, response);
      const details = typeof payload === 'object' && payload !== null ? (payload as ApiErrorPayload) : undefined;
      throw new ApiError(message, response.status, details);
    }

    return payload as T;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: requestHeaders = {}, ...rest } = options;
    const headers = { ...(requestHeaders as Record<string, string>) };

    this.ensureJsonContentType(headers, body);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await proxyApiRequest(endpoint, {
        method,
        body,
        headers,
        signal: controller.signal,
        ...rest,
      });

      return await this.parseResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('API request timed out', 408);
      }
      if (error instanceof ApiError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Unknown error occurred', 500);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: data });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData, options: { method?: 'POST' | 'PUT' | 'PATCH'; headers?: Record<string, string> } = {}): Promise<T> {
    const { method = 'POST', headers = {} } = options;

    const response = await proxyUploadRequest(endpoint, formData, {
      method,
      headers,
    });

    return this.parseResponse<T>(response);
  }
}

export const apiService = new ApiService();