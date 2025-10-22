import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@services/api/apiClient';
import { ArticleSummary } from '@services/api/types';
import { useAppTheme } from '@core/theme';

import { RootStackParamList } from '@app/navigation/types';

const EditoriaScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Editoria'>>();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['editoria', route.params.slug],
    queryFn: () => api.getEditoriaBySlug(route.params.slug)
  });

  const openArticle = useCallback(
    (article: ArticleSummary) => {
      navigation.navigate('Article', {
        articleSlug: article.slug,
        editoriaSlug: route.params.slug,
        title: article.title
      });
    },
    [navigation, route.params.slug]
  );

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
      {isError ? (
        <Text style={{ color: theme.colors.danger }}>{t('errors.generic')}</Text>
      ) : null}

      {data?.articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          onPress={() => openArticle(article)}
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            borderRadius: 12,
            marginBottom: theme.spacing.sm,
            borderWidth: 1,
            borderColor: theme.colors.border
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text }}>
            {article.title}
          </Text>
          {article.excerpt ? (
            <Text style={{ color: theme.colors.muted, marginTop: theme.spacing.xs }}>
              {article.excerpt}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default EditoriaScreen;
