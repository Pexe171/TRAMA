import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'tramorama.authToken';

export const tokenStorage = {
  getToken: async (): Promise<string | null> => {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  setToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  clearToken: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};
