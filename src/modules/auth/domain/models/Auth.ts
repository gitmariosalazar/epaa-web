import type { User } from '@/modules/users/domain/models/User';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  username_or_email: string;
  password: string;
}
