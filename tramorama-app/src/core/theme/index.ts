import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { create } from 'zustand';

import { palette } from './colors';

type Spacing = 4 | 8 | 12 | 16 | 20 | 24 | 32;

type Typography = {
  fontFamily: string;
  weights: {
    regular: string;
    medium: string;
    bold: string;
  };
};

export type Theme = {
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', Spacing>;
  typography: Typography;
};

const baseTypography: Typography = {
  fontFamily: 'System',
  weights: {
    regular: '400',
    medium: '600',
    bold: '700'
  }
};

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: palette.backgroundLight,
    surface: palette.surfaceLight,
    primary: palette.primary,
    secondary: palette.secondary,
    text: palette.textLight,
    muted: palette.mutedLight,
    border: palette.borderLight,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24
  },
  typography: baseTypography
};

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: palette.backgroundDark,
    surface: palette.surfaceDark,
    primary: palette.primaryDark,
    secondary: palette.secondary,
    text: palette.textDark,
    muted: palette.mutedDark,
    border: palette.borderDark,
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger
  },
  spacing: lightTheme.spacing,
  typography: baseTypography
};

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeStore = {
  preference: ThemePreference;
  hydrated: boolean;
  setPreference: (preference: ThemePreference) => Promise<void>;
  hydrate: () => Promise<void>;
};

const THEME_STORAGE_KEY = 'tramorama.themePreference';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  preference: 'system',
  hydrated: false,
  setPreference: async (preference) => {
    set({ preference });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
  },
  hydrate: async () => {
    if (get().hydrated) {
      return;
    }

    const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (
      storedPreference === 'light' ||
      storedPreference === 'dark' ||
      storedPreference === 'system'
    ) {
      set({ preference: storedPreference });
    }

    set({ hydrated: true });
  }
}));

const resolveColorScheme = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName,
): 'light' | 'dark' => {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }

  return preference;
};

export const useAppTheme = () => {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const hydrated = useThemeStore((state) => state.hydrated);
  const hydrate = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const colorScheme = resolveColorScheme(preference, systemScheme);
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return {
    theme,
    preference,
    colorScheme,
    hydrated,
    setPreference
  };
};
