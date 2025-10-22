import { create } from 'zustand';

import { api, setAuthToken } from '@services/api/apiClient';
import { tokenStorage } from '@services/storage/tokenStorage';
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload
} from '@services/api/types';

import { logger } from '@core/utils/logger';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  hydrated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  hydrated: false,
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.login(payload);
      await setAuthToken(data.token);
      set({ user: data.user, token: data.token, isLoading: false, error: null });
    } catch (error) {
      logger.error('Erro ao autenticar usuário', error);
      set({ error: 'Não foi possível entrar', isLoading: false });
      throw error;
    }
  },
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.register(payload);
      await setAuthToken(data.token);
      set({ user: data.user, token: data.token, isLoading: false, error: null });
    } catch (error) {
      logger.error('Erro ao registrar usuário', error);
      set({ error: 'Não foi possível criar sua conta', isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await setAuthToken(null);
    set({ user: null, token: null, error: null });
  },
  hydrate: async () => {
    if (get().hydrated) {
      return;
    }

    const storedToken = await tokenStorage.getToken();
    if (storedToken) {
      await setAuthToken(storedToken);
      set({ token: storedToken });
    }

    set({ hydrated: true });
  }
}));
