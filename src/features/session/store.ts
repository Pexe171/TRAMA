import { create } from 'zustand';

import { cacheStorage } from 'services/storage/cacheStorage';
import { secureToken } from 'services/storage/secureToken';
import { loginRequest, registerRequest } from 'features/auth/api';
import {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload
} from 'features/auth/api/types';

const USER_CACHE_KEY = 'auth-user';

export type SessionStatus = 'idle' | 'loading' | 'authenticated';

export type SessionState = {
  user: AuthUser | null;
  token: string | null;
  status: SessionStatus;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  setSession: (session: AuthResponse) => Promise<void>;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  token: null,
  status: 'idle',
  error: null,
  initialized: false,
  initialize: async () => {
    if (get().initialized || get().status === 'loading') {
      return;
    }

    set({ status: 'loading', error: null });

    try {
      const [token, cachedUser] = await Promise.all([
        secureToken.getToken(),
        cacheStorage.get<AuthUser>(USER_CACHE_KEY)
      ]);

      if (token) {
        set({
          token,
          user: cachedUser ?? null,
          status: 'authenticated',
          error: null,
          initialized: true
        });
        return;
      }

      set({
        token: null,
        user: null,
        status: 'idle',
        error: null,
        initialized: true
      });
    } catch (_error) {
      set({
        token: null,
        user: null,
        status: 'idle',
        error: 'Não foi possível carregar a sessão.',
        initialized: true
      });
    }
  },
  setSession: async ({ token, user }) => {
    await Promise.all([
      secureToken.setToken(token),
      cacheStorage.set<AuthUser>(USER_CACHE_KEY, user)
    ]);

    set({ token, user, status: 'authenticated', error: null, initialized: true });
  },
  login: async (payload) => {
    set({ status: 'loading', error: null });

    try {
      const response = await loginRequest(payload);
      await get().setSession(response);
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
      await get().setSession(response);
      return response;
    } catch (error) {
      set({ status: 'idle', error: 'Não foi possível realizar o cadastro.' });
      throw error;
    }
  },
  logout: async () => {
    await Promise.all([
      secureToken.removeToken(),
      cacheStorage.remove(USER_CACHE_KEY)
    ]);

    set({
      user: null,
      token: null,
      status: 'idle',
      error: null,
      initialized: true
    });
  }
}));
