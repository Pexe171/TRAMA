import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../core/theme';
import { Button } from './Button';
import { Text } from './Text';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export const ErrorState: React.FC<Props> = ({
  title,
  description,
  actionLabel,
  onRetry
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        padding: theme.spacing.xl,
        alignItems: 'center',
        gap: theme.spacing.md
      }}
    >
      <Text variant="subtitle" weight="bold">
        {title}
      </Text>
      {description ? (
        <Text style={{ textAlign: 'center' }} color={theme.colors.textSecondary}>
          {description}
        </Text>
      ) : null}
      {onRetry ? (
        <Button title={actionLabel ?? 'Tentar novamente'} onPress={onRetry} />
      ) : null}
    </View>
  );
};
