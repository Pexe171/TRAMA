import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'tramorama-query-cache'
});

export const persistOptions: PersistQueryClientOptions = {
  persister: asyncStoragePersister,
  maxAge: 24 * 60 * 60 * 1000
};
