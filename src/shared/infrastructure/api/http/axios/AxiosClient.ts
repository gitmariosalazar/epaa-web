import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import type { HttpClientInterface } from '../../interfaces/HttpClientInterface';
import type { ApiResponse } from '../../response/ApiResponse';
import { environments } from '@/settings/environments/environments';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { tokenRefreshCoordinator } from '@/shared/infrastructure/services/TokenRefreshCoordinator';

export class AxiosHttpClient implements HttpClientInterface {
  private axiosInstance = axios.create();
  private unauthorizedHandler?: (error: any) => Promise<void>;

  constructor() {
    console.log(
      `AxiosHttpClient initialized with API URL: ${environments.API_URL}`
    );
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorageService.getItem('token');
        const isPublicEndpoint =
          config.url?.includes('/auth/signin') ||
          config.url?.includes('/auth/refresh') ||
          config.url?.includes('/auth/verify');

        if (token && !isPublicEndpoint) {
          config.headers['Authorization'] = `Bearer ${token}`;
        } else if (!token && !isPublicEndpoint) {
          const error: any = new Error('No token found');
          error.response = { status: 401 };
          return Promise.reject(error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private setupResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        // Don't try to refresh if the refresh endpoint itself returns 401
        if (originalRequest.url?.includes('/auth/refresh')) {
          if (this.unauthorizedHandler) {
            await this.unauthorizedHandler(error);
          }
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          // Shared with AuthContext's proactive refresh timer: concurrent
          // callers await the same in-flight request instead of racing the
          // backend's single-use refresh token rotation.
          const session = await tokenRefreshCoordinator.refresh();

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${session.accessToken}`
          };
          return this.axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorageService.removeItem('token');
          localStorageService.removeItem('refreshToken');
          localStorageService.removeItem('user');

          if (this.unauthorizedHandler) {
            await this.unauthorizedHandler(refreshError);
          }
          return Promise.reject(refreshError);
        }
      }
    );
  }

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

    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        ...options,
        method: method.toUpperCase(),
        url: `${environments.API_URL}${url}`,
        headers,
        data: body,
        withCredentials: true
      });

      return {
        status_code: response.status,
        time: dateService.getCurrentDate(),
        message: ['Request successful'],
        url: `${environments.API_URL}${url}`,
        data: response.data
      };
    } catch (error: any) {
      if (error.name === 'AbortError') throw new Error('Request was aborted');

      const errorMessage = error.response?.data?.message || error.message;
      const apiError: any = new Error(errorMessage);
      apiError.status = error.response?.status;
      apiError.data = error.response?.data;
      apiError.isAxiosError = error.isAxiosError;

      throw apiError;
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
