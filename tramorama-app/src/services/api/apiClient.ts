import axios, { AxiosInstance } from 'axios';

import { appConfig } from '@core/config/appConfig';
import { logger } from '@core/utils/logger';
import { tokenStorage } from '@services/storage/tokenStorage';

import {
  AboutResponse,
  Article,
  AuthResponse,
  Editoria,
  EditoriaResponse,
  HomeResponse,
  LoginPayload,
  RegisterPayload
} from './types';

let inMemoryToken: string | null = null;

const resolveToken = async (): Promise<string | null> => {
  if (inMemoryToken) {
    return inMemoryToken;
  }

  const storedToken = await tokenStorage.getToken();
  inMemoryToken = storedToken;
  return storedToken;
};

const buildClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: appConfig.apiBaseUrl,
    timeout: 15_000
  });

  instance.interceptors.request.use(async (config) => {
    const token = await resolveToken();

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        inMemoryToken = null;
        await tokenStorage.clearToken();
      }

      logger.error('Erro na chamada à API', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = buildClient();

export const setAuthToken = async (token: string | null) => {
  inMemoryToken = token;
  if (token) {
    await tokenStorage.setToken(token);
  } else {
    await tokenStorage.clearToken();
  }
};

export const api = {
  getHome: async (): Promise<HomeResponse> => {
    const response = await apiClient.get<HomeResponse>('/api/home');
    return response.data;
  },
  getEditorias: async (): Promise<Editoria[]> => {
    const response = await apiClient.get<Editoria[]>('/api/editorias');
    return response.data;
  },
  getEditoriaBySlug: async (slug: string): Promise<EditoriaResponse> => {
    const response = await apiClient.get<EditoriaResponse>(`/api/editorias/${slug}`);
    return response.data;
  },
  getArticleBySlug: async (
    editoriaSlug: string,
    articleSlug: string
  ): Promise<Article> => {
    const response = await apiClient.get<Article>(
      `/api/articles/${editoriaSlug}/${articleSlug}`
    );
    return response.data;
  },
  getAbout: async (): Promise<AboutResponse> => {
    const response = await apiClient.get<AboutResponse>('/api/quem-somos');
    return response.data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
    return response.data;
  }
};
