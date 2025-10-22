import { darkColors, lightColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  name: ThemeMode;
  colors: typeof lightColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  shadow: {
    sm: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: lightColors,
  spacing,
  typography,
  radius: {
    sm: 8,
    md: 16,
    lg: 24
  },
  shadow: {
    sm: {
      shadowColor: '#0F172A1A',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2
    },
    md: {
      shadowColor: '#0F172A1A',
      shadowOpacity: 0.16,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4
    }
  }
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: darkColors,
  spacing,
  typography,
  radius: {
    sm: 8,
    md: 16,
    lg: 24
  },
  shadow: {
    sm: {
      shadowColor: '#00000033',
      shadowOpacity: 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4
    },
    md: {
      shadowColor: '#00000055',
      shadowOpacity: 0.3,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8
    }
  }
};

export const getNavigationTheme = (mode: ThemeMode) => ({
  dark: mode === 'dark',
  colors: {
    primary: mode === 'dark' ? darkColors.primary : lightColors.primary,
    background: mode === 'dark' ? darkColors.background : lightColors.background,
    card: mode === 'dark' ? darkColors.surface : lightColors.surface,
    text: mode === 'dark' ? darkColors.text : lightColors.text,
    border: mode === 'dark' ? darkColors.border : lightColors.border,
    notification: mode === 'dark' ? darkColors.secondary : lightColors.secondary
  }
});
