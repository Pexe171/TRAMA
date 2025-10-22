import React, { useEffect, useMemo } from 'react';
import { Image, ScrollView, Share, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { env } from '../../core/config/env';
import { useTheme } from '../../core/theme';
import { formatDate, formatViews } from '../../core/utils/format';
import { Button, Card, ErrorState, Loading, Text } from '../components';
import { useArticle } from '../../features/article/hooks/useArticle';
import { useProfileContent } from '../../features/profile/hooks/useProfileContent';
import { RootStackParamList } from '../navigation/types';

export type ArticleScreenProps = NativeStackScreenProps<RootStackParamList, 'Article'>;

export const ArticleScreen: React.FC<ArticleScreenProps> = ({ route }) => {
  const { editoriaSlug, articleSlug } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isOffline } = useArticle(editoriaSlug, articleSlug);
  const { favorites, toggleFavorite, registerHistory } = useProfileContent();

  useEffect(() => {
    if (data) {
      const timestamp = new Date().toISOString();
      registerHistory({
        id: data.id,
        title: data.title,
        slug: data.slug,
        editoriaSlug: data.editoria.slug,
        editoriaTitle: data.editoria.title,
        coverImage: data.coverImage,
        savedAt: timestamp,
        lastViewedAt: timestamp
      });
    }
  }, [data, registerHistory]);

  const isFavorite = useMemo(
    () => favorites.some((favorite) => favorite.id === data?.id),
    [favorites, data?.id]
  );

  const handleToggleFavorite = async () => {
    if (!data) {
      return;
    }

    await toggleFavorite({
      id: data.id,
      title: data.title,
      slug: data.slug,
      editoriaSlug: data.editoria.slug,
      editoriaTitle: data.editoria.title,
      coverImage: data.coverImage,
      savedAt: new Date().toISOString()
    });
  };

  const handleShare = async () => {
    if (!data) {
      return;
    }

    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const url = `${baseUrl}/editorias/${data.editoria.slug}/${articleSlug}`;
    await Share.share({
      title: data.title,
      message: `${data.title}\n${url}`
    });
  };

  if (isLoading && !data) {
    return <Loading label={t('common.loading')} />;
  }

  if (error && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.lg }}>
        <ErrorState
          title={t('common.genericError')}
          actionLabel={t('common.retry')}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!data) {
    return null;
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
        <View style={{ gap: theme.spacing.md }}>
          <View>
            <Text variant="overline" color={theme.colors.textSecondary}>
              {data.editoria.title}
            </Text>
            <Text variant="title" weight="bold">
              {data.title}
            </Text>
          </View>

          {data.coverImage ? (
            <Image
              source={{ uri: data.coverImage }}
              style={{
                width: '100%',
                height: 220,
                borderRadius: theme.radius.md
              }}
            />
          ) : null}

          <View style={{ gap: theme.spacing.xs }}>
            <Text color={theme.colors.textSecondary}>
              {t('article.author', { author: data.author.name })}
            </Text>
            <Text color={theme.colors.textSecondary}>
              {formatDate(data.publishedAt)} · {t('article.views', { value: formatViews(data.viewCount) })}
            </Text>
          </View>

          {isOffline ? (
            <View
              style={{
                backgroundColor: theme.colors.surfaceAlt,
                padding: theme.spacing.sm,
                borderRadius: theme.radius.sm
              }}
            >
              <Text color={theme.colors.textSecondary}>{t('common.offline')}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <Button
              title={isFavorite ? t('common.removeFavorite') : t('common.addFavorite')}
              variant={isFavorite ? 'secondary' : 'ghost'}
              onPress={handleToggleFavorite}
            />
            <Button title={t('common.share')} variant="ghost" onPress={handleShare} />
          </View>
        </View>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.md }}>
          {data.content
            .split(/\n\n+/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <Text key={index} style={{ lineHeight: theme.typography.lineHeight.lg }}>
                {paragraph}
              </Text>
            ))}
        </View>
      </Card>
    </ScrollView>
  );
};
