import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import type { HttpClientInterface } from '../../interfaces/HttpClientInterface';
import type { ApiResponse } from '../../response/ApiResponse';
import { environments } from '@/settings/environments/environments';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export class AxiosHttpClient implements HttpClientInterface {
  private axiosInstance = axios.create();
  private unauthorizedHandler?: (error: any) => Promise<void>;

  // --- Queue to prevent multiple simultaneous refresh calls ---
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[] = [];

  constructor() {
    console.log(`AxiosHttpClient initialized with API URL: ${environments.API_URL}`);
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
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
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

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

        // If already refreshing, queue this request
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`
            };
            return this.axiosInstance(originalRequest);
          });
        }

        // Start the refresh process
        originalRequest._retry = true;
        this.isRefreshing = true;

        const storedRefreshToken = localStorageService.getItem('refreshToken');
        if (!storedRefreshToken) {
          this.isRefreshing = false;
          if (this.unauthorizedHandler) {
            await this.unauthorizedHandler(error);
          }
          return Promise.reject(error);
        }

        try {
          const response: AxiosResponse = await this.axiosInstance.post(
            `${environments.API_URL}/auth/refresh`,
            { refreshToken: storedRefreshToken },
            { withCredentials: true }
          );

          const session = response.data?.data;
          const newAccessToken: string = session?.accessToken;
          const newRefreshToken: string = session?.refreshToken;

          if (!newAccessToken) throw new Error('No access token in refresh response');

          // Persist new tokens
          localStorageService.setItem('token', newAccessToken);
          if (newRefreshToken) {
            localStorageService.setItem('refreshToken', newRefreshToken);
          }

          // Retry queued requests with new token
          this.processQueue(null, newAccessToken);

          // Retry original request
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`
          };
          return this.axiosInstance(originalRequest);
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          localStorageService.removeItem('token');
          localStorageService.removeItem('refreshToken');
          localStorageService.removeItem('user');

          if (this.unauthorizedHandler) {
            await this.unauthorizedHandler(refreshError);
          }
          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
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
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async get<T>(url: string, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, body?: unknown, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T>(url: string, body?: unknown, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async delete<T>(url: string, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  async patch<T>(url: string, body?: unknown, options: Record<string, any> = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }
}
