import React from 'react';
import { ActivityIndicator } from 'react-native';

import { Loading } from 'app/components/Loading';

import { renderWithProviders } from './test-utils';

describe('Loading', () => {
  it('exibe indicador de progresso e rótulo', async () => {
    const { UNSAFE_getByType, getByText } = await renderWithProviders(
      <Loading label="Carregando dados" />
    );

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(getByText('Carregando dados')).toBeTruthy();
  });

  it('não mostra rótulo quando não informado', async () => {
    const { UNSAFE_getByType, queryByText } = await renderWithProviders(<Loading />);

    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(queryByText(/carregando/i)).toBeNull();
  });
});
