import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ThemeProvider } from '../../../core/theme/ThemeProvider';
import { Button } from '../Button';

describe('Button', () => {
  const renderWithTheme = (children: React.ReactNode) =>
    render(<ThemeProvider>{children}</ThemeProvider>);

  it('aciona o callback ao tocar', async () => {
    const onPress = jest.fn();
    const { findByText } = renderWithTheme(<Button title="Ação" onPress={onPress} />);

    const button = await findByText('Ação');
    fireEvent.press(button);

    expect(onPress).toHaveBeenCalled();
  });
});
