import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@core/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { RootStackParamList } from '@app/navigation/types';
import { NavigationProp } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert(t('errors.required'));
      return;
    }

    try {
      await register({ name, email, password });
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert(t('errors.generic'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors.text }}>
            {t('navigation.register')}
          </Text>
          <Text style={{ color: theme.colors.muted, marginTop: theme.spacing.sm }}>
            Crie sua conta para acessar conteúdos exclusivos.
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
            {t('auth.name')}
          </Text>
          <TextInput
            placeholder={t('auth.name')}
            placeholderTextColor={theme.colors.muted}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
            {t('auth.email')}
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={t('auth.email')}
            placeholderTextColor={theme.colors.muted}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
            {t('auth.password')}
          </Text>
          <TextInput
            secureTextEntry
            placeholder={t('auth.password')}
            placeholderTextColor={theme.colors.muted}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 12,
              padding: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? (
          <Text style={{ color: theme.colors.danger, marginBottom: theme.spacing.sm }}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{ marginBottom: theme.spacing.md }}
        >
          <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>
            {t('navigation.login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!isLoading) {
              void handleSubmit();
            }
          }}
          style={{
            backgroundColor: theme.colors.primary,
            padding: theme.spacing.md,
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: theme.colors.background, fontWeight: '600', fontSize: 16 }}>
            {isLoading ? 'Carregando...' : t('auth.registerCta')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
