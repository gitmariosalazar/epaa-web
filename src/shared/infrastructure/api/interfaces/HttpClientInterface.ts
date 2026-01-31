import type { ApiResponse } from '../response/ApiResponse';

export interface HttpClientInterface {
  request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  get<T>(url: string, options?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(
    url: string,
    body?: unknown,
    options?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  put<T>(
    url: string,
    body?: unknown,
    options?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  delete<T>(
    url: string,
    options?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  patch<T>(
    url: string,
    body?: unknown,
    options?: Record<string, any>
  ): Promise<ApiResponse<T>>;
  setUnauthorizedHandler: (handler: (error: any) => Promise<void>) => void;
}
