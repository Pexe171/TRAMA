import React from 'react';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { persistOptions, queryClient } from 'core/config/queryClient';
import i18n from 'core/i18n';
import { ThemeProvider, useTheme } from 'core/theme';
import { AppNavigator } from 'app/navigation/AppNavigator';

const ThemedNavigation: React.FC = () => {
  const { navigationTheme, mode } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme as NavigationTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
};

export const AppProviders: React.FC<{ children?: React.ReactNode }> = () => (
  <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedNavigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </I18nextProvider>
  </PersistQueryClientProvider>
);

export default AppProviders;
