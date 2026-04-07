import type {
  AuthSession,
  LoginCredentials
} from '@/modules/auth/domain/models/Auth';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class AuthRepositoryImpl implements AuthRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/signin',
      credentials
    );
    return response.data.data;
  }

  async signOut(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    await this.client.post('/auth/signout', { refreshToken });
  }

  async refreshToken(): Promise<AuthSession> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  }

}
