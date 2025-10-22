import { useQuery } from '@tanstack/react-query';

import { fetchHome } from '../api';
import { HomeData } from '../types';

const HOME_QUERY_KEY = ['home'];

export const useHome = () => {
  const query = useQuery<HomeData>({
    queryKey: HOME_QUERY_KEY,
    queryFn: fetchHome
  });

  const isOffline = Boolean(query.error) && Boolean(query.data);

  return {
    ...query,
    isOffline
  };
};
