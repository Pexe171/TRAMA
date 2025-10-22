import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@services/api/apiClient';
import { useAppTheme } from '@core/theme';
import { formatDate } from '@core/utils/date';

import { RootStackParamList } from '@app/navigation/types';

const ArticleScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const route = useRoute<RouteProp<RootStackParamList, 'Article'>>();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['article', route.params.editoriaSlug, route.params.articleSlug],
    queryFn: () => api.getArticleBySlug(route.params.editoriaSlug, route.params.articleSlug)
  });

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

      {data ? (
        <View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.text }}>
            {data.title}
          </Text>
          <Text
            style={{
              color: theme.colors.muted,
              marginTop: theme.spacing.xs,
              marginBottom: theme.spacing.lg
            }}
          >
            {formatDate(data.publishedAt)}
          </Text>
          <Text style={{ color: theme.colors.text, lineHeight: 22 }}>{data.content}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ArticleScreen;
