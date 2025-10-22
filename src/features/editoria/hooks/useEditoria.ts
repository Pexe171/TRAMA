import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { fetchEditoriaDetails } from '../api';
import { EditoriaDetails } from '../types';

const buildKey = (slug: string): [string, string] => ['editoria', slug];

export const useEditoria = (slug: string) => {
  const query = useInfiniteQuery<
    EditoriaDetails,
    Error,
    InfiniteData<EditoriaDetails, number>,
    [string, string],
    number
  >({
    queryKey: buildKey(slug),
    queryFn: ({ pageParam }) => fetchEditoriaDetails(slug, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined
  });

  const pages = query.data?.pages ?? [];
  const header = pages[0];
  const articles = pages.flatMap((page) => page.articles);

  const isOffline = Boolean(query.error) && pages.length > 0;

  return {
    ...query,
    header,
    articles,
    isOffline
  };
};
