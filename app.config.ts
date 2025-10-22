import { config } from 'dotenv';
import { ExpoConfig } from 'expo/config';

config();

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://dominio-do-trama/api';

const expoConfig: ExpoConfig = {
  name: 'Trama',
  slug: 'trama',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'trama',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android', 'web'],
  splash: {
    image: 'https://images.prismic.io/trama/logo-trama.png',
    resizeMode: 'contain',
    backgroundColor: '#111315'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.trama.app'
  },
  android: {
    package: 'com.trama.app',
    adaptiveIcon: {
      foregroundImage: 'https://images.prismic.io/trama/logo-trama.png',
      backgroundColor: '#111315'
    }
  },
  extra: {
    apiBaseUrl: API_BASE_URL
  }
};

export default expoConfig;
