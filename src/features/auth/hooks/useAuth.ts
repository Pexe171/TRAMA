import { useEffect } from 'react';

import { useSessionStore } from 'features/session/store';

export const useAuth = () => {
  const initialize = useSessionStore((state) => state.initialize);
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const token = useSessionStore((state) => state.token);
  const login = useSessionStore((state) => state.login);
  const register = useSessionStore((state) => state.register);
  const logout = useSessionStore((state) => state.logout);
  const error = useSessionStore((state) => state.error);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { status, user, token, login, register, logout, error };
};

export const useIsAuthenticated = () =>
  useSessionStore((state) => state.status === 'authenticated');
