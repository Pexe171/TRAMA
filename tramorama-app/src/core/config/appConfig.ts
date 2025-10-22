import Constants from 'expo-constants';

import { logger } from '@core/utils/logger';

export type AppConfig = {
  apiBaseUrl: string;
};

const extra = Constants.expoConfig?.extra ?? {};
const apiBaseUrl = typeof extra?.apiBaseUrl === 'string' ? extra.apiBaseUrl : '';

if (!apiBaseUrl) {
  logger.warn('API_BASE_URL não foi configurada. Configure o arquivo .env.');
}

export const appConfig: AppConfig = {
  apiBaseUrl
};
