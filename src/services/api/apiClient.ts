import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

import { logger } from 'core/utils/logger';
import { secureToken } from 'services/storage/secureToken';

const DEFAULT_BASE_URL = 'https://dominio-do-trama/api';
const API_BASE_URL = process.env.API_BASE_URL ?? DEFAULT_BASE_URL;

if (!process.env.API_BASE_URL) {
  logger.warn(
    'API_BASE_URL não foi definida nas variáveis de ambiente. Utilizando o valor padrão.'
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

type RequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedRequest = {
  config: RequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
};

const failedQueue: FailedRequest[] = [];
let isRefreshing = false;

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

const shouldSkipAuthRefresh = (url?: string) => {
  if (!url) {
    return false;
  }

  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const processQueue = (error?: AxiosError, token?: string) => {
  while (failedQueue.length > 0) {
    const { config, resolve, reject } = failedQueue.shift()!;

    if (error) {
      reject(error);
      continue;
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }

    apiClient(config)
      .then(resolve)
      .catch(reject);
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const currentToken = await secureToken.getToken();

  if (!currentToken) {
    throw new Error('Token ausente para renovação.');
  }

  const response = await axios.post<{ token: string }>(
    '/auth/refresh',
    undefined,
    {
      baseURL: API_BASE_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`
      }
    }
  );

  const newToken = response.data.token;
  await secureToken.setToken(newToken);

  return newToken;
};

apiClient.interceptors.request.use(async (config) => {
  const token = await secureToken.getToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response, config } = error;

    if (!response) {
      logger.error('Erro de rede ao comunicar com a API.', error);
      return Promise.reject(error);
    }

    const originalRequest = config as RequestConfig | undefined;

    if (response.status === 401 && originalRequest && !shouldSkipAuthRefresh(originalRequest.url)) {
      if (originalRequest._retry) {
        await secureToken.removeToken();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ config: originalRequest, resolve, reject });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(undefined, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        await secureToken.removeToken();
        logger.warn('Não foi possível renovar a sessão do usuário.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (response.status === 401) {
      await secureToken.removeToken();
      logger.warn('Sessão expirada. Faça login novamente.');
    } else if (response.status >= 500) {
      logger.error('Erro interno do servidor.', error);
    }

    return Promise.reject(error);
  }
);

const mapResponse = <T>(promise: Promise<AxiosResponse<T>>) =>
  promise.then((response) => response.data);

export const getHome = <T>() => mapResponse<T>(apiClient.get<T>('/home'));

export const getEditorias = <T>() => mapResponse<T>(apiClient.get<T>('/editorias'));

export const getEditoriaBySlug = <T>(slug: string, params?: Record<string, unknown>) =>
  mapResponse<T>(
    apiClient.get<T>(`/editorias/${slug}`, {
      params
    })
  );

export const getArticle = <T>(editoriaSlug: string, articleSlug: string) =>
  mapResponse<T>(apiClient.get<T>(`/articles/${editoriaSlug}/${articleSlug}`));

export const getQuemSomos = <T>() => mapResponse<T>(apiClient.get<T>('/quem-somos'));

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const login = <T>(payload: LoginPayload) =>
  mapResponse<T>(apiClient.post<T>('/auth/login', payload));

export const register = <T>(payload: RegisterPayload) =>
  mapResponse<T>(apiClient.post<T>('/auth/register', payload));

export const api = {
  client: apiClient,
  getHome,
  getEditorias,
  getEditoriaBySlug,
  getArticle,
  getQuemSomos,
  login,
  register
};
