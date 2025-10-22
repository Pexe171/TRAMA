import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@trama:cache:';

type CachedValue<T> = {
  value: T;
  timestamp: number;
  ttl?: number;
};

const withKey = (key: string) => `${CACHE_PREFIX}${key}`;

export const cacheStorage = {
  async set<T>(key: string, value: T, ttl?: number) {
    const payload: CachedValue<T> = {
      value,
      timestamp: Date.now(),
      ttl
    };

    await AsyncStorage.setItem(withKey(key), JSON.stringify(payload));
  },
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(withKey(key));

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as CachedValue<T>;
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        await AsyncStorage.removeItem(withKey(key));
        return null;
      }

      return parsed.value;
    } catch (error) {
      await AsyncStorage.removeItem(withKey(key));
      return null;
    }
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(withKey(key));
  }
};
