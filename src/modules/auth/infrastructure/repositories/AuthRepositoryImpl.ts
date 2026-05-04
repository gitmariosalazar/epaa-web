import type {
  AuthSession,
  LoginCredentials,
  VerifyUserRequest,
  VerifyUserResult,
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

  /**
   * Calls POST /auth/verify — no auth header required (public endpoint).
   * Sends the stored username/email to assert the account still exists
   * and is active in the backend before granting access.
   */
  async verifyUser(payload: VerifyUserRequest): Promise<VerifyUserResult> {
    const response = await this.client.post<ApiResponse<VerifyUserResult>>(
      '/auth/verify',
      payload
    );
    return response.data.data;
  }
}

