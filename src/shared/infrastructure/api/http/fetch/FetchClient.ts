import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { environments } from '@/settings/environments/environments';

export class FetchHttpClient implements HttpClientInterface {
  constructor() {
    console.log(
      `FetchHttpClient initialized with API URL: ${environments.API_URL}`
    );
  }

  private unauthorizedHandler?: (error: any) => Promise<void>;

  setUnauthorizedHandler(handler: (error: any) => Promise<void>) {
    this.unauthorizedHandler = handler;
  }

  async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, any>) || {})
    };

    const token = localStorage.getItem('token');
    const isPublicEndpoint =
      url.includes('/auth/signin') || url.includes('/auth/refresh-token');

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    } else if (!isPublicEndpoint) {
      // If no token and not a public endpoint, cancel request (simulate 401)
      const error: any = new Error('No token found');
      if (this.unauthorizedHandler) {
        await this.unauthorizedHandler(error);
      }
      throw error;
    }

    const fullUrl = `${environments.API_URL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method: method.toUpperCase(),
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        ...options
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401 && this.unauthorizedHandler) {
          await this.unauthorizedHandler(new Error('Unauthorized'));
        }

        const errorMessage =
          responseData?.message?.[0] ||
          responseData?.message ||
          'Request failed!';
        throw new Error(errorMessage);
      }

      const apiResponse: ApiResponse<T> = {
        status_code: response.status,
        time: new Date(),
        message: responseData.message || ['Request successful'],
        url: fullUrl,
        data: responseData
      };

      return apiResponse;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request was aborted');
      }

      throw new Error(error.message || 'Unexpected error occurred');
    }
  }

  async get<T>(
    url: string,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(
    url: string,
    body?: unknown,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T>(
    url: string,
    body?: unknown,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async delete<T>(
    url: string,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  async patch<T>(
    url: string,
    body?: unknown,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }
}
