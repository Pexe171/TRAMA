import { useQuery } from '@tanstack/react-query';

import { fetchArticle } from '../api';
import { ArticleContent } from '../types';

const buildKey = (editoriaSlug: string, articleSlug: string) => [
  'article',
  editoriaSlug,
  articleSlug
];

export const useArticle = (editoriaSlug?: string, articleSlug?: string) => {
  const query = useQuery<ArticleContent>({
    queryKey: buildKey(editoriaSlug ?? '', articleSlug ?? ''),
    queryFn: () => fetchArticle(editoriaSlug ?? '', articleSlug ?? ''),
    enabled: Boolean(editoriaSlug && articleSlug)
  });

  const isOffline = Boolean(query.error) && Boolean(query.data);

  return {
    ...query,
    isOffline
  };
};
