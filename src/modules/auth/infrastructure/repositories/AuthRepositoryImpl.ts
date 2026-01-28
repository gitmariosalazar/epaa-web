import type { AuthSession, LoginCredentials } from '@/modules/auth/domain/models/Auth';
import type { AuthRepository } from '@/modules/auth/domain/repositories/AuthRepository';
import { api } from '@/shared/infrastructure/http/api';

export class AuthRepositoryImpl implements AuthRepository {
  async signIn(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await api.post('/auth/signin', credentials);
    // Adjust based on actual API response structure (ApiResponse wrapper)
    // Assuming backend returns { data: AuthResponse, ... }
    return response.data.data;
  }

  async signOut(): Promise<void> {
    await api.post('/auth/signout');
  }

  async refreshToken(): Promise<AuthSession> {
    const response = await api.post('/auth/refresh-token');
    return response.data.data;
  }
}
