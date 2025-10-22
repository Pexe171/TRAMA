import Constants from 'expo-constants';

const extra = Constants?.expoConfig?.extra ?? Constants?.manifest?.extra ?? {};

type ExtraConfig = {
  apiBaseUrl?: string;
};

const parsedExtra = extra as ExtraConfig;

export const env = {
  apiBaseUrl: parsedExtra.apiBaseUrl ?? 'https://dominio-do-trama/api'
};
