import { create } from 'zustand';

import { favoritesStorage } from '../storage/favoritesStorage';
import { historyStorage } from '../storage/historyStorage';
import { ProfileArticle, ProfileHistoryItem } from '../types';

type ProfileState = {
  favorites: ProfileArticle[];
  history: ProfileHistoryItem[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
  load: () => Promise<void>;
  toggleFavorite: (article: ProfileArticle) => Promise<void>;
  registerHistory: (entry: ProfileHistoryItem) => Promise<void>;
  clearHistory: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  favorites: [],
  history: [],
  loading: false,
  initialized: false,
  error: null,
  load: async () => {
    if (get().loading || get().initialized) {
      return;
    }

    set({ loading: true });

    try {
      const [favorites, history] = await Promise.all([
        favoritesStorage.getAll(),
        historyStorage.getAll()
      ]);

      set({ favorites, history, loading: false, initialized: true, error: null });
    } catch (error) {
      set({ loading: false, error: 'Não foi possível carregar o perfil.' });
    }
  },
  toggleFavorite: async (article) => {
    const updated = await favoritesStorage.toggle(article);
    set({ favorites: updated });
  },
  registerHistory: async (entry) => {
    const updated = await historyStorage.upsert(entry);
    set({ history: updated });
  },
  clearHistory: async () => {
    await historyStorage.clear();
    set({ history: [] });
  }
}));
