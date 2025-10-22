import { useQuery } from '@tanstack/react-query';

import { fetchEditorias } from '../api';
import { Editoria } from '../types';

const EDITORIAS_QUERY_KEY = ['editorias'];

export const useEditorias = () => {
  const query = useQuery<Editoria[]>({
    queryKey: EDITORIAS_QUERY_KEY,
    queryFn: fetchEditorias
  });

  const isOffline = Boolean(query.error) && Boolean(query.data);

  return {
    ...query,
    isOffline
  };
};
