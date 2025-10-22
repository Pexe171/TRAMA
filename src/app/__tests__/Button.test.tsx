import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Button } from 'app/components/Button';

import { renderWithProviders } from './test-utils';

describe('Button', () => {
  it('aciona o callback ao tocar', async () => {
    const onPress = jest.fn();

    const { getByRole } = await renderWithProviders(
      <Button title="Explorar" onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('mostra indicador de carregamento quando loading é verdadeiro', async () => {
    const { getByRole, queryByText } = await renderWithProviders(
      <Button title="Salvar" loading />
    );

    expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
    expect(queryByText('Salvar')).toBeNull();
  });
});
