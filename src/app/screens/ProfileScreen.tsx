import React from 'react';
import { ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'core/theme';
import { Button, Card, Loading, Text } from 'app/components';
import { useAuth } from 'features/auth/hooks/useAuth';
import { useProfileContent } from 'features/profile/hooks/useProfileContent';
import { RootStackParamList } from 'app/navigation/types';

export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, logout, status } = useAuth();
  const { favorites, history, loading, error, toggleFavorite, clearHistory } = useProfileContent();

  if (status !== 'authenticated') {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
          gap: theme.spacing.md
        }}
      >
        <Text variant="subtitle" weight="bold" style={{ textAlign: 'center' }}>
          {t('auth.loginTitle')}
        </Text>
        <Text color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
          {t('profile.loginPrompt')}
        </Text>
        <Button
          title={t('common.login')}
          onPress={() => navigation.navigate('Auth', { mode: 'login' })}
        />
        <Button
          title={t('common.register')}
          variant="ghost"
          onPress={() => navigation.navigate('Auth', { mode: 'register' })}
        />
      </View>
    );
  }

  if (loading) {
    return <Loading label={t('common.loading')} />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.lg }}>
        <Card>
          <Text color={theme.colors.danger}>{error}</Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: theme.spacing.lg,
        gap: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl
      }}
    >
      <Card elevated>
        <View style={{ gap: theme.spacing.sm }}>
          <Text variant="subtitle" weight="bold">
            {user?.name}
          </Text>
          <Text color={theme.colors.textSecondary}>{user?.email}</Text>
          <Button title={t('common.logout')} variant="ghost" onPress={logout} />
        </View>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text variant="subtitle" weight="bold">
              {t('common.favorites')}
            </Text>
          </View>

          {favorites.length === 0 ? (
            <Text color={theme.colors.textSecondary}>{t('profile.favoritesEmpty')}</Text>
          ) : (
            favorites.map((favorite) => (
              <Card
                key={favorite.id}
                onPress={() =>
                  navigation.navigate('Article', {
                    editoriaSlug: favorite.editoriaSlug,
                    articleSlug: favorite.slug,
                    title: favorite.title
                  })
                }
              >
                <View style={{ gap: theme.spacing.xs }}>
                  <Text weight="bold">{favorite.title}</Text>
                  <Text color={theme.colors.textSecondary}>{favorite.editoriaTitle}</Text>
                  <Button
                    title={t('common.removeFavorite')}
                    variant="ghost"
                    onPress={() => toggleFavorite(favorite)}
                  />
                </View>
              </Card>
            ))
          )}
        </View>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text variant="subtitle" weight="bold">
              {t('common.history')}
            </Text>
            {history.length > 0 ? (
              <Button
                title={t('common.clear')}
                variant="ghost"
                onPress={clearHistory}
              />
            ) : null}
          </View>

          {history.length === 0 ? (
            <Text color={theme.colors.textSecondary}>{t('profile.historyEmpty')}</Text>
          ) : (
            history.map((item) => (
              <Card
                key={`${item.id}-${item.lastViewedAt}`}
                onPress={() =>
                  navigation.navigate('Article', {
                    editoriaSlug: item.editoriaSlug,
                    articleSlug: item.slug,
                    title: item.title
                  })
                }
              >
                <View style={{ gap: theme.spacing.xs }}>
                  <Text weight="bold">{item.title}</Text>
                  <Text color={theme.colors.textSecondary}>{item.editoriaTitle}</Text>
                  <Text color={theme.colors.textSecondary}>
                    Último acesso: {new Date(item.lastViewedAt).toLocaleString('pt-BR')}
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </Card>
    </ScrollView>
  );
};
