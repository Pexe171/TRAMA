import { create } from 'zustand';

import { cacheStorage } from 'services/storage/cacheStorage';
import { secureTokenStorage } from 'services/storage/secureTokenStorage';
import { loginRequest, registerRequest } from '../api';
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '../api/types';

const USER_CACHE_KEY = 'auth-user';

type AuthStatus = 'idle' | 'loading' | 'authenticated';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: 'idle',
  error: null,
  initialize: async () => {
    if (get().status !== 'idle') {
      return;
    }

    set({ status: 'loading' });

    try {
      const [token, cachedUser] = await Promise.all([
        secureTokenStorage.getToken(),
        cacheStorage.get<AuthUser>(USER_CACHE_KEY)
      ]);

      set({
        token: token ?? null,
        user: token && cachedUser ? cachedUser : null,
        status: token ? 'authenticated' : 'idle',
        error: null
      });
    } catch (error) {
      set({ status: 'idle', error: 'Não foi possível carregar a sessão.' });
    }
  },
  login: async (payload) => {
    set({ status: 'loading', error: null });

    try {
      const response = await loginRequest(payload);
      await secureTokenStorage.setToken(response.token);
      await cacheStorage.set<AuthUser>(USER_CACHE_KEY, response.user);

      set({ user: response.user, token: response.token, status: 'authenticated' });
      return response;
    } catch (error) {
      set({ status: 'idle', error: 'Credenciais inválidas.' });
      throw error;
    }
  },
  register: async (payload) => {
    set({ status: 'loading', error: null });

    try {
      const response = await registerRequest(payload);
      await secureTokenStorage.setToken(response.token);
      await cacheStorage.set<AuthUser>(USER_CACHE_KEY, response.user);

      set({ user: response.user, token: response.token, status: 'authenticated' });
      return response;
    } catch (error) {
      set({ status: 'idle', error: 'Não foi possível realizar o cadastro.' });
      throw error;
    }
  },
  logout: async () => {
    await Promise.all([
      secureTokenStorage.removeToken(),
      cacheStorage.remove(USER_CACHE_KEY)
    ]);
    set({ user: null, token: null, status: 'idle', error: null });
  }
}));
