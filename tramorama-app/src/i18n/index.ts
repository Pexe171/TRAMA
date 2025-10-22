import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS }
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    compatibilityJSON: 'v3',
    lng: Localization.getLocales()?.[0]?.languageTag ?? 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
