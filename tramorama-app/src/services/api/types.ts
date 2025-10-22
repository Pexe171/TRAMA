export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  editoriaSlug: string;
  editoriaName?: string;
  publishedAt: string;
};

export type HomeResponse = {
  highlights: ArticleSummary[];
  latest: ArticleSummary[];
};

export type Editoria = {
  slug: string;
  name: string;
  description?: string;
};

export type EditoriaResponse = {
  editoria: Editoria;
  articles: ArticleSummary[];
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  editoria: Editoria;
  publishedAt: string;
  coverImage?: string;
  author?: string;
};

export type AboutResponse = {
  title: string;
  content: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
