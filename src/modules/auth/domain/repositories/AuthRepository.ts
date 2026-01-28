import type { AuthSession, LoginCredentials } from '../models/Auth';

export interface AuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  refreshToken(): Promise<AuthSession>;
}
