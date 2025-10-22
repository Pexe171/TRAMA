import { getArticle } from 'services/api/apiClient';
import { ArticleContent } from '../types';

export const fetchArticle = (editoriaSlug: string, articleSlug: string) =>
  getArticle<ArticleContent>(editoriaSlug, articleSlug);
