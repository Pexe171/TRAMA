import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '../../core/theme';
import { Text } from './Text';

type Props = {
  label?: string;
};

export const Loading: React.FC<Props> = ({ label }) => {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl
      }}
    >
      <ActivityIndicator color={theme.colors.primary} />
      {label ? (
        <Text style={{ marginTop: theme.spacing.sm }} color={theme.colors.textSecondary}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};
