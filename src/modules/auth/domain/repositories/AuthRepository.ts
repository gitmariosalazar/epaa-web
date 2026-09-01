import type {
  AuthSession,
  LoginCredentials,
  VerifyUserRequest,
  VerifyUserResult,
} from '../models/Auth';

export interface AuthRepository {
  signIn(credentials: LoginCredentials): Promise<AuthSession>;
  signOut(): Promise<void>;
  refreshToken(): Promise<AuthSession>;
  /**
   * Calls POST /auth/verify to assert that a user account still exists
   * and is active in the backend, regardless of local session state.
   */
  verifyUser(payload: VerifyUserRequest): Promise<VerifyUserResult>;
  
  /**
   * Elevates the session token using a security PIN.
   */
  unlockModule(userId: string, pin: string): Promise<{ elevated_token: string }>;
}
