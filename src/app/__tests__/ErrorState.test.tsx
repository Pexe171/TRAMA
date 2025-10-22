import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { ErrorState } from 'app/components/ErrorState';

import { renderWithProviders } from './test-utils';

describe('ErrorState', () => {
  it('exibe título, descrição e aciona onRetry', async () => {
    const onRetry = jest.fn();

    const { getByText } = await renderWithProviders(
      <ErrorState
        title="Algo deu errado"
        description="Não foi possível carregar os dados"
        onRetry={onRetry}
      />
    );

    expect(getByText('Algo deu errado')).toBeTruthy();
    expect(getByText('Não foi possível carregar os dados')).toBeTruthy();

    fireEvent.press(getByText('Tentar novamente'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('não mostra botão quando nenhuma ação é informada', async () => {
    const { queryByText } = await renderWithProviders(
      <ErrorState title="Ops" description="Sem ação disponível" />
    );

    expect(queryByText('Tentar novamente')).toBeNull();
  });
});
