import axios from 'axios';
import { environments } from '@/settings/environments/environments';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';
import type { AuthSession } from '@/modules/auth/domain/models/Auth';

/**
 * Single-flight guard for POST /auth/refresh.
 *
 * The backend rotates refresh tokens (single-use): each successful refresh
 * invalidates the previous refresh token. The app has two independent
 * triggers that can call refresh at nearly the same time — the proactive
 * timer in AuthContext and the reactive 401 handler in AxiosHttpClient.
 * Without coordination, both could fire concurrently with the same stored
 * refreshToken; whichever reaches the backend second would fail because the
 * first already rotated/invalidated it, causing a spurious logout.
 *
 * This coordinator ensures only one refresh request is ever in flight:
 * concurrent callers await the same promise instead of issuing duplicate
 * requests.
 */
class TokenRefreshCoordinator {
  private inFlight: Promise<AuthSession> | null = null;

  refresh(): Promise<AuthSession> {
    if (!this.inFlight) {
      this.inFlight = this.performRefresh().finally(() => {
        this.inFlight = null;
      });
    }
    return this.inFlight;
  }

  private async performRefresh(): Promise<AuthSession> {
    const storedRefreshToken = localStorageService.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('No refresh token found');
    }

    // Plain axios call (not the app's interceptor-wrapped instance) to avoid
    // any risk of re-entering the 401 refresh interceptor.
    const response = await axios.post(
      `${environments.API_URL}/auth/refresh`,
      { refreshToken: storedRefreshToken },
      { withCredentials: true }
    );

    const session: AuthSession | undefined = response.data?.data;
    if (!session?.accessToken) {
      throw new Error('No access token in refresh response');
    }

    localStorageService.setItem('token', session.accessToken);
    if (session.refreshToken) {
      localStorageService.setItem('refreshToken', session.refreshToken);
    }
    if (session.user) {
      localStorageService.setItem('user', JSON.stringify(session.user));
    }

    return session;
  }
}

export const tokenRefreshCoordinator = new TokenRefreshCoordinator();
