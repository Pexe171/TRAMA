import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Card } from 'app/components/Card';
import { Text } from 'app/components/Text';

import { renderWithProviders } from './test-utils';

describe('Card', () => {
  it('renderiza os filhos corretamente', async () => {
    const { getByText } = await renderWithProviders(
      <Card>
        <Text>Conteúdo importante</Text>
      </Card>
    );

    expect(getByText('Conteúdo importante')).toBeTruthy();
  });

  it('dispara a ação ao pressionar quando há onPress', async () => {
    const onPress = jest.fn();

    const { getByRole } = await renderWithProviders(
      <Card onPress={onPress}>
        <Text>Abrir</Text>
      </Card>
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
