import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProfileArticle } from '../types';

const STORAGE_KEY = '@trama:favorites';

const read = async (): Promise<ProfileArticle[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ProfileArticle[];
  } catch (error) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const write = (data: ProfileArticle[]) =>
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const favoritesStorage = {
  getAll: read,
  async add(article: ProfileArticle) {
    const current = await read();
    const exists = current.some((item) => item.id === article.id);
    if (exists) {
      return current;
    }

    const updated = [article, ...current];
    await write(updated);
    return updated;
  },
  async remove(articleId: string) {
    const current = await read();
    const updated = current.filter((item) => item.id !== articleId);
    await write(updated);
    return updated;
  },
  async toggle(article: ProfileArticle) {
    const current = await read();
    const exists = current.some((item) => item.id === article.id);
    if (exists) {
      return favoritesStorage.remove(article.id);
    }

    return favoritesStorage.add(article);
  }
};
