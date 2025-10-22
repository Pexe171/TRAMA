import axios, { AxiosRequestHeaders } from 'axios';

import { env } from '../../core/config/env';
import { logger } from '../../core/utils/logger';
import { secureTokenStorage } from '../storage/secureTokenStorage';

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureTokenStorage.getToken();
  if (token) {
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureTokenStorage.removeToken();
    }

    logger.error('Erro na chamada de API', error);
    return Promise.reject(error);
  }
);

const mapData = <T>(promise: Promise<{ data: T }>) => promise.then((response) => response.data);

export const api = {
  client: apiClient,
  getHome: <T>() => mapData<T>(apiClient.get('/home')),
  getEditorias: <T>() => mapData<T>(apiClient.get('/editorias')),
  getEditoriaBySlug: <T>(slug: string, params?: Record<string, unknown>) =>
    mapData<T>(
      apiClient.get(`/editorias/${slug}`, {
        params
      })
    ),
  getArticle: <T>(editoriaSlug: string, articleSlug: string) =>
    mapData<T>(apiClient.get(`/articles/${editoriaSlug}/${articleSlug}`)),
  getQuemSomos: <T>() => mapData<T>(apiClient.get('/quem-somos')),
  login: <T>(payload: LoginPayload) => mapData<T>(apiClient.post('/auth/login', payload)),
  register: <T>(payload: RegisterPayload) =>
    mapData<T>(apiClient.post('/auth/register', payload))
};
