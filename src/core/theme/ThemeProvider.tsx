import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Appearance } from 'react-native';

import { darkTheme, getNavigationTheme, lightTheme, Theme, ThemeMode } from './themes';

const THEME_STORAGE_KEY = '@trama:theme-preference';

type ThemePreference = ThemeMode | 'system';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  toggleMode: () => Promise<void>;
  navigationTheme: ReturnType<typeof getNavigationTheme>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemMode = (): ThemeMode =>
  (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getSystemMode());
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setPreferenceState(stored);
          setMode(stored);
        } else {
          setPreferenceState('system');
          setMode(getSystemMode());
        }
      } finally {
        setHydrated(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (preference === 'system') {
        setMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription.remove();
  }, [preference]);

  const persistPreference = useCallback(async (value: ThemePreference) => {
    if (value === 'system') {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
    }
  }, []);

  const handlePreferenceChange = useCallback(
    async (value: ThemePreference) => {
      setPreferenceState(value);
      if (value === 'system') {
        setMode(getSystemMode());
      } else {
        setMode(value);
      }
      if (hydrated) {
        await persistPreference(value);
      }
    },
    [hydrated, persistPreference]
  );

  const toggleMode = useCallback(async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    await handlePreferenceChange(next);
  }, [handlePreferenceChange, mode]);

  const theme = useMemo<Theme>(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      preference,
      setPreference: handlePreferenceChange,
      toggleMode,
      navigationTheme: getNavigationTheme(mode)
    }),
    [handlePreferenceChange, mode, preference, theme, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  }

  return context;
};
