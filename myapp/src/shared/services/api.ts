import { API_CONFIG } from '@/shared/constants';
import { proxyApiRequest } from '@/lib/apiProxy';

/**
 * Base API Service Class
 */
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
  ): Promise<T> {
    const { method = 'GET', body, headers: requestHeaders = {}, ...rest } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        ...(requestHeaders as Record<string, string>),
      };

      const preparedBody = body;

      if (
        preparedBody !== undefined &&
        preparedBody !== null &&
        !(preparedBody instanceof FormData) &&
        typeof preparedBody !== 'string' &&
        !headers['Content-Type']
      ) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await proxyApiRequest(endpoint, {
        method,
        body: preparedBody,
        headers,
        signal: controller.signal,
        ...rest,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('API Request timed out');
      }
      if (error instanceof Error) {
        throw new Error(`API Request failed: ${error.message}`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include credentials for cookie-based auth
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const apiService = new ApiService();