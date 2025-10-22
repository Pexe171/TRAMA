import React from 'react';
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from 'core/theme';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'overline';

type Props = {
  variant?: TextVariant;
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
} & RNTextProps;

type FontKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const variantStyles: Record<TextVariant, FontKey> = {
  title: 'xl',
  subtitle: 'lg',
  body: 'md',
  caption: 'sm',
  overline: 'xs'
};

export const Text: React.FC<Props> = ({
  variant = 'body',
  weight = 'regular',
  color,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();

  const fontSizeToken = variantStyles[variant];
  const fontSize = theme.typography.fontSize[fontSizeToken];
  const lineHeight = theme.typography.lineHeight[fontSizeToken];

  const fontFamily = theme.typography.fontFamily[weight];

  return (
    <RNText
      style={[
        {
          color: color ?? theme.colors.text,
          fontSize,
          lineHeight,
          fontFamily
        },
        style
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};
