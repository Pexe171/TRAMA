import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle
} from 'react-native';

import { useTheme } from 'core/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'style'>;

export const Button: React.FC<Props> = ({
  title,
  loading = false,
  disabled,
  variant = 'primary',
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  const backgroundColor = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    ghost: 'transparent'
  }[variant];

  const textColor =
    variant === 'ghost'
      ? theme.colors.primary
      : variant === 'secondary'
        ? theme.colors.onSecondary
        : theme.colors.onPrimary;
  const borderColor = variant === 'ghost' ? theme.colors.primary : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radius.md
        },
        style
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={{
            color: textColor,
            fontSize: theme.typography.fontSize.md,
            fontFamily: theme.typography.fontFamily.medium,
            textAlign: 'center'
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1
  }
});
