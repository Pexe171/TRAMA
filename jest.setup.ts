import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
import { Appearance } from 'react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined)
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-constants', () => ({
  expoConfig: { extra: { apiBaseUrl: 'https://dominio-do-trama/api' } }
}));

jest.mock('expo-localization', () => ({
  getLocales: () => [
    { languageTag: 'pt-BR', languageCode: 'pt', regionCode: 'BR', isRTL: false }
  ]
}));

jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');

const mockAppearanceSubscription = {
  remove: jest.fn()
} as ReturnType<typeof Appearance.addChangeListener>;

jest
  .spyOn(Appearance, 'addChangeListener')
  .mockImplementation(() => mockAppearanceSubscription);
