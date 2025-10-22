import { api } from 'services/api/apiClient';
import { ArticleContent } from '../types';

export const fetchArticle = (editoriaSlug: string, articleSlug: string) =>
  api.getArticle<ArticleContent>(editoriaSlug, articleSlug);
