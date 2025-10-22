import React from 'react';

import { Text } from 'app/components/Text';
import { lightTheme } from 'core/theme';

import { renderWithProviders } from './test-utils';

describe('Text', () => {
  it('aplica estilos do tema para o variant informado', async () => {
    const { getByText } = await renderWithProviders(
      <Text variant="title" weight="bold">
        Manchete
      </Text>
    );

    expect(getByText('Manchete')).toHaveStyle({
      fontSize: lightTheme.typography.fontSize.xl,
      fontFamily: lightTheme.typography.fontFamily.bold,
      lineHeight: lightTheme.typography.lineHeight.xl
    });
  });

  it('permite definir uma cor personalizada', async () => {
    const { getByText } = await renderWithProviders(
      <Text color="#123456">Personalizado</Text>
    );

    expect(getByText('Personalizado')).toHaveStyle({ color: '#123456' });
  });
});
