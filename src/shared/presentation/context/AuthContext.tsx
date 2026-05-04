import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import type {
  AuthSession,
  LoginCredentials
} from '@/modules/auth/domain/models/Auth';
import { SessionExpirationDialog } from '@/shared/presentation/components/Auth/SessionExpirationDialog';
import { LoginUseCase } from '@/modules/auth/application/usecases/LoginUseCase';
import { LogoutUseCase } from '@/modules/auth/application/usecases/LogoutUseCase';
import { RefreshTokenUseCase } from '@/modules/auth/application/usecases/RefreshTokenUseCase';
import {
  VerifyUserUseCase,
  UserNotFoundError,
  UserInactiveError,
} from '@/modules/auth/application/usecases/VerifyUserUseCase';
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/repositories/AuthRepositoryImpl';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';
import {
  getTokenExpirationMs,
  isTokenExpired
} from '@/shared/infrastructure/services/JwtService';
import { userActivityService } from '@/shared/infrastructure/services/UserActivityService';

interface AuthContextType {
  user: AuthSession['user'] | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUserSession: (user: AuthSession['user']) => void;
  /**
   * Re-runs the backend verify check for the current session.
   * Returns true if the session is still valid, false if it was invalidated.
   * Components (e.g. ProtectedRoute) can call this on mount for an extra
   * security assertion beyond just checking the local token.
   */
  verifySessionIntegrity: () => Promise<boolean>;
  isLoading: boolean;
  /** True while the initial POST /auth/verify call is in-flight on startup. */
  isVerifying: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// How many ms before expiration to fire the proactive refresh timer
const REFRESH_BUFFER_MS = 30_000; // 30 seconds

// How much time a user must be idle to stop automatic refreshes (e.g. 15 minutes)
const MAX_IDLE_TIME_MS = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isExtendingSession, setIsExtendingSession] = useState(false);

  // Timer ref for proactive token expiration detection
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use cases via Dependency Injection (DIP)
  const authRepository = new AuthRepositoryImpl();
  const loginUseCase = new LoginUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const refreshTokenUseCase = new RefreshTokenUseCase(authRepository);
  const verifyUserUseCase = new VerifyUserUseCase(authRepository);

  /**
   * Attempts a silent token refresh when the proactive timer fires.
   * Only proceeds if the user has been active within the MAX_IDLE_TIME_MS.
   * On success: persists the new session and reschedules the timer.
   * On failure/inactivity: shows the SessionExpirationDialog.
   */
  const attemptSilentRefresh = useCallback(async () => {
    // SECURITY: Check if user is idle before refreshing
    if (userActivityService.isIdle(MAX_IDLE_TIME_MS)) {
      console.info(
        '[AuthContext] User is idle — stopping proactive refresh for security.'
      );
      setIsSessionExpired(true);
      return;
    }

    try {
      const session = await refreshTokenUseCase.execute();
      // persistSession will also reschedule the timer for the new token
      persistSession(session);
    } catch {
      // Silent refresh failed — let the user decide
      setIsSessionExpired(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Schedules a proactive refresh timer based on the JWT `exp` claim.
   * Fires REFRESH_BUFFER_MS before the token expires.
   * Cancels any previously scheduled timer.
   */
  const scheduleTokenRefresh = useCallback(
    (accessToken: string) => {
      // Clear any existing timer before scheduling a new one
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      const expMs = getTokenExpirationMs(accessToken);
      if (expMs === null) {
        // Token has no `exp` claim — fall back to reactive (401) approach
        console.warn('[AuthContext] Token has no `exp` claim; proactive refresh disabled.');
        return;
      }

      const delay = expMs - Date.now() - REFRESH_BUFFER_MS;

      if (delay <= 0) {
        // Token is already expired or about to expire — attempt refresh immediately
        console.info('[AuthContext] Token already expired or within buffer — refreshing now.');
        attemptSilentRefresh();
        return;
      }

      console.info(
        `[AuthContext] Proactive refresh scheduled in ${Math.round(delay / 1000)}s.`
      );
      refreshTimerRef.current = setTimeout(() => {
        attemptSilentRefresh();
      }, delay);
    },
    [attemptSilentRefresh]
  );

  const persistSession = (session: AuthSession) => {
    setToken(session.accessToken);
    setUser(session.user);
    localStorageService.setItem('token', session.accessToken);
    localStorageService.setItem('refreshToken', session.refreshToken);
    localStorageService.setItem('user', JSON.stringify(session.user));
    // Schedule proactive refresh for the new access token
    scheduleTokenRefresh(session.accessToken);
  };

  const clearSession = () => {
    // Cancel any pending refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    setToken(null);
    setUser(null);
    localStorageService.removeItem('token');
    localStorageService.removeItem('refreshToken');
    localStorageService.removeItem('user');
  };

  /**
   * SECURITY: Verifies the cached session against the backend.
   *
   * Algorithm:
   * 1. Read the stored user identifier (username or email) from localStorage.
   * 2. Call POST /auth/verify — the backend asserts the account exists and is active.
   * 3. On any failure (network error, user not found, account inactive):
   *    wipe the local session and redirect to /login to prevent unauthorized access.
   *
   * SECURITY POLICY: fail-closed — any ambiguous or failed verify call
   * results in session revocation, not silent pass-through.
   *
   * @returns `true` if the session is valid, `false` if it was invalidated.
   */
  const verifySessionIntegrity = useCallback(async (): Promise<boolean> => {
    const storedUser = localStorageService.getItem('user');
    if (!storedUser) return false;

    let parsedUser: AuthSession['user'];
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      // Corrupted storage — clear and bail
      clearSession();
      return false;
    }

    // Use `username` as the primary identifier; fall back to `email`
    const identifier = parsedUser.username ?? parsedUser.email;
    if (!identifier) {
      console.warn('[AuthContext] No identifier found in stored user — clearing session.');
      clearSession();
      return false;
    }

    setIsVerifying(true);
    try {
      await verifyUserUseCase.execute({ username_or_email: identifier });
      console.info('[AuthContext] Session integrity verified ✓');
      return true;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        console.warn('[AuthContext] SECURITY: User no longer exists — invalidating session.');
      } else if (error instanceof UserInactiveError) {
        console.warn('[AuthContext] SECURITY: User account is inactive — invalidating session.');
      } else {
        // Network failure, timeout, 5xx, or unexpected error.
        // FAIL-CLOSED: revoke the local session to prevent stale access.
        console.error('[AuthContext] Verify call failed — failing closed for security.', error);
      }
      clearSession();
      window.location.href = '/login';
      return false;
    } finally {
      setIsVerifying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    // SECURITY: Initialize activity tracking
    userActivityService.init();

    const storedToken = localStorageService.getItem('token');
    const storedUser = localStorageService.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      if (isTokenExpired(storedToken)) {
        // Token already expired on load — attempt silent refresh immediately
        console.info(
          '[AuthContext] Stored token is expired on load — attempting refresh.'
        );
        attemptSilentRefresh();
      } else {
        // Token still valid — schedule the proactive refresh timer
        scheduleTokenRefresh(storedToken);
      }

      // SECURITY: Even with a valid local token, verify the account still
      // exists and is active on the backend. This guards against:
      //  - deleted accounts with cached tokens
      //  - deactivated accounts
      //  - revoked sessions not yet reflected locally
      verifySessionIntegrity();
    }

    setIsLoading(false);

    // Fallback: when a request fails even after silent refresh, show the expiration dialog.
    // IMPORTANT: Only trigger if there is an active session (user is logged in).
    // This prevents the dialog from appearing on the login page when there is no token.
    apiClient.setUnauthorizedHandler(async () => {
      const storedToken = localStorageService.getItem('token');
      if (storedToken) {
        setIsSessionExpired(true);
      }
    });

    return () => {
      // Cleanup activity listeners
      userActivityService.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const session = await loginUseCase.execute(credentials);
    persistSession(session);
  };

  const logout = async () => {
    try {
      await logoutUseCase.execute();
    } catch {
      // Ensure local cleanup even if API call fails
    } finally {
      clearSession();
      setIsSessionExpired(false);
      window.location.href = '/login';
    }
  };

  const handleExtendSession = async () => {
    setIsExtendingSession(true);
    try {
      const session = await refreshTokenUseCase.execute();
      persistSession(session);
      setIsSessionExpired(false);
    } catch {
      await logout();
    } finally {
      setIsExtendingSession(false);
    }
  };

  const updateUserSession = (updatedUser: AuthSession['user']) => {
    setUser(updatedUser);
    localStorageService.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUserSession,
        verifySessionIntegrity,
        isLoading,
        isVerifying,
      }}
    >
      {children}
      {/* Only render the expiration dialog when a session is active to
          prevent it from appearing on the login page. */}
      {user !== null && (
        <SessionExpirationDialog
          isOpen={isSessionExpired}
          onExtend={handleExtendSession}
          onCancel={logout}
          isExtending={isExtendingSession}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
