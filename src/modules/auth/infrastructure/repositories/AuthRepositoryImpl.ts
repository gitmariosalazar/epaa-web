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
    await this.client.post('/auth/signout');
  }

  async refreshToken(): Promise<AuthSession> {
    const response = await this.client.post<ApiResponse<AuthSession>>(
      '/auth/refresh-token'
    );
    return response.data.data;
  }
}
