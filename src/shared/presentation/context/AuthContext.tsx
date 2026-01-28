import {
  type ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState
} from 'react';
import type {
  AuthSession,
  LoginCredentials
} from '@/modules/auth/domain/models/Auth';
import { SessionExpirationDialog } from '@/shared/presentation/components/Auth/SessionExpirationDialog';
import { LoginUseCase } from '@/modules/auth/application/usecases/LoginUseCase';
import { AuthRepositoryImpl } from '@/modules/auth/infrastructure/repositories/AuthRepositoryImpl';
import { registerSessionExpiredCallback } from '../../infrastructure/http/api';

interface AuthContextType {
  user: AuthSession['user'] | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUserSession: (user: AuthSession['user']) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthSession['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isExtendingSession, setIsExtendingSession] = useState(false);

  // Dependency Injection could be improved with a DI container, but manual is fine for React Context
  const authRepository = new AuthRepositoryImpl();
  const loginUseCase = new LoginUseCase(authRepository);

  useLayoutEffect(() => {
    // Check local storage for existing session
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Register session expired callback
    registerSessionExpiredCallback(() => {
      setIsSessionExpired(true);
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const session = await loginUseCase.execute(credentials);
      setToken(session.accessToken);
      setUser(session.user);
      localStorage.setItem('token', session.accessToken);
      localStorage.setItem('user', JSON.stringify(session.user));
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsSessionExpired(false);
    window.location.href = '/login';
  };

  const handleExtendSession = async () => {
    setIsExtendingSession(true);
    try {
      const session = await authRepository.refreshToken();
      setToken(session.accessToken);
      setUser(session.user);
      localStorage.setItem('token', session.accessToken);
      localStorage.setItem('user', JSON.stringify(session.user));
      setIsSessionExpired(false);
    } catch (error) {
      console.error('Failed to extend session', error);
      logout();
    } finally {
      setIsExtendingSession(false);
    }
  };

  const handleCancelSession = () => {
    logout();
  };

  const updateUserSession = (updatedUser: AuthSession['user']) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUserSession, isLoading }}
    >
      {children}
      <SessionExpirationDialog
        isOpen={isSessionExpired}
        onExtend={handleExtendSession}
        onCancel={handleCancelSession}
        isExtending={isExtendingSession}
      />
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
