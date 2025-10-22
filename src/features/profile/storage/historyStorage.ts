import AsyncStorage from '@react-native-async-storage/async-storage';

import { ProfileHistoryItem } from '../types';

const STORAGE_KEY = '@trama:history';

const read = async (): Promise<ProfileHistoryItem[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ProfileHistoryItem[];
  } catch (error) {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

const write = (data: ProfileHistoryItem[]) =>
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export const historyStorage = {
  getAll: read,
  async upsert(article: ProfileHistoryItem) {
    const current = await read();
    const filtered = current.filter((item) => item.id !== article.id);
    const updated = [article, ...filtered].slice(0, 50);
    await write(updated);
    return updated;
  },
  async clear() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
};
