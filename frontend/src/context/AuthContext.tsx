import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { storage } from '../utils/storage';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = storage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
        storage.setUser(me);
      } catch {
        storage.clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void init();
  }, []);

  const persistAuth = useCallback((token: string, authUser: User) => {
    storage.setToken(token);
    storage.setUser(authUser);
    setUser(authUser);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { token, user: authUser } = await authService.login(credentials);
      persistAuth(token, authUser);
    },
    [persistAuth]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const { token, user: authUser } = await authService.register(credentials);
      persistAuth(token, authUser);
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
