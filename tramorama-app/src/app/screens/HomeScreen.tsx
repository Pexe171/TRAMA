import React, { useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@services/api/apiClient';
import { ArticleSummary } from '@services/api/types';
import { useAppTheme } from '@core/theme';
import { useAuthStore } from '@features/auth/store/useAuthStore';

import { RootStackParamList } from '@app/navigation/types';

const SectionList: React.FC<{
  title: string;
  data?: ArticleSummary[];
  onPressItem: (item: ArticleSummary) => void;
}> = ({ title, data = [], onPressItem }) => {
  const { theme } = useAppTheme();

  if (!data.length) {
    return null;
  }

  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: theme.colors.text,
          marginBottom: theme.spacing.sm
        }}
      >
        {title}
      </Text>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onPressItem(item)}
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: 12,
            marginBottom: theme.spacing.sm,
            borderWidth: 1,
            borderColor: theme.colors.border
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
            {item.title}
          </Text>
          {item.excerpt ? (
            <Text style={{ color: theme.colors.muted, marginTop: theme.spacing.xs }}>
              {item.excerpt}
            </Text>
          ) : null}
          <Text
            style={{
              color: theme.colors.muted,
              marginTop: theme.spacing.xs,
              fontSize: 12
            }}
          >
            {item.editoriaName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const authLoading = useAuthStore((state) => state.isLoading);

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['home'],
    queryFn: api.getHome
  });

  const openArticle = useCallback(
    (article: ArticleSummary) => {
      navigation.navigate('Article', {
        articleSlug: article.slug,
        editoriaSlug: article.editoriaSlug,
        title: article.title
      });
    },
    [navigation]
  );

  const openSections = useCallback(() => {
    navigation.navigate('Sections');
  }, [navigation]);

  const openAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  const handleAuthAction = useCallback(() => {
    if (user) {
      void logout();
    } else {
      navigation.navigate('Login');
    }
  }, [logout, navigation, user]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isRefetching}
          onRefresh={() => {
            void refetch();
          }}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors.text }}>
          {t('home.welcome')}
        </Text>
        <Text
          style={{
            marginTop: theme.spacing.sm,
            color: theme.colors.muted,
            fontSize: 16
          }}
        >
          {t('home.description')}
        </Text>
        <Text style={{ marginTop: theme.spacing.sm, color: theme.colors.muted }}>
          {user ? t('home.greeting', { name: user.name }) : t('home.authCall')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: theme.spacing.lg
          }}
        >
          <TouchableOpacity
            onPress={openSections}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: 999,
              marginRight: theme.spacing.sm,
              marginBottom: theme.spacing.sm
            }}
          >
            <Text style={{ color: theme.colors.background, fontWeight: '600' }}>
              {t('navigation.sections')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openAbout}
            style={{
              backgroundColor: theme.colors.surface,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.border,
              marginRight: theme.spacing.sm,
              marginBottom: theme.spacing.sm
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
              {t('navigation.about')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAuthAction}
            disabled={authLoading}
            style={{
              backgroundColor: theme.colors.secondary,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: 999,
              opacity: authLoading ? 0.7 : 1,
              marginBottom: theme.spacing.sm
            }}
          >
            <Text style={{ color: theme.colors.background, fontWeight: '600' }}>
              {user ? t('auth.logout') : t('navigation.login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isError ? (
        <Text style={{ color: theme.colors.danger }}>{t('errors.generic')}</Text>
      ) : null}

      <SectionList
        title={t('home.highlights')}
        data={data?.highlights}
        onPressItem={openArticle}
      />
      <SectionList title={t('home.latest')} data={data?.latest} onPressItem={openArticle} />
    </ScrollView>
  );
};

export default HomeScreen;
