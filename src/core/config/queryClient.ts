import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientConfig
} from '@tanstack/react-query';
import { PersistQueryClientProviderProps } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const queryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24
    }
  }
};

export const queryClient = new QueryClient(queryConfig);

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => {
    setOnline(Boolean(state.isConnected));
  })
);

focusManager.setEventListener((handleFocus) => {
  const onAppStateChange = (status: AppStateStatus) => {
    handleFocus(status === 'active');
  };

  const subscription = AppState.addEventListener('change', onAppStateChange);

  return () => subscription.remove();
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'trama-query-cache',
  throttleTime: 1000
});

export const persistOptions: PersistQueryClientProviderProps['persistOptions'] = {
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24
};
