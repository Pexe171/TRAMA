import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle
} from 'react-native';

import { useTheme } from '../../core/theme';

type Props = {
  elevated?: boolean;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
} & ViewProps;

export const Card: React.FC<Props> = ({
  elevated = false,
  onPress,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const Container = onPress ? Pressable : View;

  const shadowStyle = elevated ? theme.shadow.md : theme.shadow.sm;

  return (
    <Container
      {...(onPress ? { accessibilityRole: 'button', onPress } : {})}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
          borderWidth: 1,
          padding: theme.spacing.lg,
          ...(elevated ? shadowStyle : {})
        },
        style
      ]}
      {...rest}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  }
});
