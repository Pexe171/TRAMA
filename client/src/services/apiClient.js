const sanitizeBaseUrl = (url) => {
  if (!url) {
    return '';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const DEFAULT_BASE_URL = '/api';
const API_BASE_URL = sanitizeBaseUrl(process.env.REACT_APP_API_URL || DEFAULT_BASE_URL);

const buildUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }
  if (/^https?:/i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const normalizeBody = (body, headers) => {
  if (!body) {
    return undefined;
  }

  const contentType = headers.get('Content-Type');
  if (contentType && contentType.includes('application/json') && typeof body !== 'string') {
    return JSON.stringify(body);
  }

  return body;
};

const parseResponsePayload = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

export const request = async (path, options = {}) => {
  const { method = 'GET', headers: customHeaders = {}, body, ...rest } = options;

  const headers = new Headers(customHeaders);
  const upperMethod = method.toUpperCase();

  if (!headers.has('Content-Type') && body && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    method: upperMethod,
    headers,
    body: normalizeBody(body, headers),
    credentials: 'include',
    ...rest,
  });

  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.message) ||
      (typeof payload === 'string' && payload) ||
      'Não foi possível concluir a solicitação. Tente novamente em instantes.';

    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

export const api = {
  getHomeData: () => request('/home'),
  getEditorias: () => request('/editorias'),
  getEditoriaBySlug: (slug) => request(`/editorias/${slug}`),
  getArticleBySlug: (editoriaSlug, articleSlug) => request(`/articles/${editoriaSlug}/${articleSlug}`),
  getAboutPage: () => request('/quem-somos'),
  getArticleComments: (articleSlug) => request(`/interact/articles/${articleSlug}/comments`),
};

export default api;
