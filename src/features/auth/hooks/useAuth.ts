import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const error = useAuthStore((state) => state.error);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { status, user, token, login, register, logout, error };
};

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.status === 'authenticated');
