import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'trama:auth-token';

export const secureTokenStorage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY)
};
