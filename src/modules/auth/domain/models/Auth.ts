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

/** Payload sent to POST /auth/verify */
export interface VerifyUserRequest {
  username_or_email: string;
}

/**
 * Result from the backend verify endpoint.
 * `exists` — user record found in DB.
 * `isActive` — account is enabled and allowed to operate.
 */
export interface VerifyUserResult {
  exists: boolean;
  userId?: string;
  username?: string;
  email?: string;
  isActive?: boolean;
}
