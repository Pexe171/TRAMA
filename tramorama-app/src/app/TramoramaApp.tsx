import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import OfflineBanner from '@app/components/OfflineBanner';
import RootNavigator from '@app/navigation/RootNavigator';
import { useAppTheme } from '@core/theme';
import { useAppFocusManager, useOnlineManager } from '@core/hooks/useOnlineManager';
import { useAuthStore } from '@features/auth/store/useAuthStore';

const TramoramaApp: React.FC = () => {
  const { theme, colorScheme, hydrated: isThemeHydrated } = useAppTheme();
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const isAuthHydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  useOnlineManager();
  useAppFocusManager();

  const isReady = isThemeHydrated && isAuthHydrated;

  const navigationTheme: NavigationTheme = {
    dark: colorScheme === 'dark',
    colors: {
      background: theme.colors.background,
      border: theme.colors.border,
      card: theme.colors.surface,
      primary: theme.colors.primary,
      text: theme.colors.text,
      notification: theme.colors.secondary
    }
  };

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <OfflineBanner />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
};

export default TramoramaApp;
