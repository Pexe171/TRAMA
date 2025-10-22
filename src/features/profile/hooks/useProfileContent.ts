import { useEffect } from 'react';

import { useProfileStore } from '../store/profileStore';

export const useProfileContent = () => {
  const load = useProfileStore((state) => state.load);
  const favorites = useProfileStore((state) => state.favorites);
  const history = useProfileStore((state) => state.history);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);
  const toggleFavorite = useProfileStore((state) => state.toggleFavorite);
  const registerHistory = useProfileStore((state) => state.registerHistory);
  const clearHistory = useProfileStore((state) => state.clearHistory);

  useEffect(() => {
    load();
  }, [load]);

  return {
    favorites,
    history,
    loading,
    error,
    toggleFavorite,
    registerHistory,
    clearHistory
  };
};
