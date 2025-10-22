import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../core/theme';
import { Button, Card, Text } from '../components';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { RootStackParamList } from '../navigation/types';

export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

type Mode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ route, navigation }) => {
  const initialMode = route.params?.mode ?? 'login';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login, register, status, error } = useAuth();

  const isLoading = status === 'loading';

  const canSubmit = useMemo(() => {
    if (!email || !password) {
      return false;
    }

    if (mode === 'register' && (!name || !confirmPassword)) {
      return false;
    }

    return true;
  }, [email, password, confirmPassword, mode, name]);

  const handleSubmit = async () => {
    setLocalError(null);

    if (!canSubmit) {
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setLocalError(t('auth.passwordMismatch'));
      return;
    }

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }

      navigation.goBack();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setLocalError(submitError.message);
      }
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setLocalError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg, flexGrow: 1 }}>
        <Card elevated>
          <View style={{ gap: theme.spacing.md }}>
            <Text variant="title" weight="bold">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </Text>

            {mode === 'register' ? (
              <View style={{ gap: theme.spacing.xs }}>
                <Text weight="medium">{t('common.name')}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={t('common.name')}
                  autoCapitalize="words"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={{
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.text
                  }}
                />
              </View>
            ) : null}

            <View style={{ gap: theme.spacing.xs }}>
              <Text weight="medium">{t('common.email')}</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('common.email')}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={theme.colors.textSecondary}
                style={{
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.text
                }}
              />
            </View>

            <View style={{ gap: theme.spacing.xs }}>
              <Text weight="medium">{t('common.password')}</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('common.password')}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textSecondary}
                style={{
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.text
                }}
              />
            </View>

            {mode === 'register' ? (
              <View style={{ gap: theme.spacing.xs }}>
                <Text weight="medium">{t('common.confirmPassword')}</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('common.confirmPassword')}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={{
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.text
                  }}
                />
              </View>
            ) : null}

            {localError || error ? (
              <View
                style={{
                  backgroundColor: theme.colors.danger + '22',
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.md
                }}
              >
                <Text color={theme.colors.danger}>{localError ?? error}</Text>
              </View>
            ) : null}

            <Button
              title={mode === 'login' ? t('common.login') : t('common.register')}
              onPress={handleSubmit}
              disabled={!canSubmit || isLoading}
              loading={isLoading}
            />

            <Button
              title={
                mode === 'login'
                  ? t('auth.registerTitle')
                  : t('auth.loginTitle')
              }
              variant="ghost"
              onPress={toggleMode}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
