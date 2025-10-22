import React from 'react';
import { act, render, RenderOptions, RenderAPI } from '@testing-library/react-native';

import { ThemeProvider } from 'core/theme';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export const renderWithProviders = async (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): Promise<RenderAPI> => {
  const rendered = render(ui, { wrapper: Providers, ...options });

  await act(async () => {});

  return rendered;
};
