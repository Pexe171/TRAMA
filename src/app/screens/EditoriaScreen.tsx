import React from 'react';
import { FlatList, ImageBackground, RefreshControl, Share, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { env } from '../../core/config/env';
import { useTheme } from '../../core/theme';
import { Button, Card, ErrorState, Loading, Text } from '../components';
import { useEditoria } from '../../features/editoria/hooks/useEditoria';
import { RootStackParamList } from '../navigation/types';

export type EditoriaScreenProps = NativeStackScreenProps<RootStackParamList, 'Editoria'>;

export const EditoriaScreen: React.FC<EditoriaScreenProps> = ({ route, navigation }) => {
  const { slug } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { header, articles, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, error, refetch, isOffline } =
    useEditoria(slug);

  const shareArticle = async (articleSlug: string, title: string) => {
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const url = `${baseUrl}/editorias/${slug}/${articleSlug}`;
    await Share.share({
      title,
      message: `${title}\n${url}`
    });
  };

  if (isLoading && !header) {
    return <Loading label={t('common.loading')} />;
  }

  if (error && !header) {
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

  const renderHeader = () => (
    <View style={{ gap: theme.spacing.lg }}>
      {header?.heroImage ? (
        <ImageBackground
          source={{ uri: header.heroImage }}
          style={{
            height: 220,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.overlay,
              padding: theme.spacing.lg
            }}
          >
            <Text variant="title" weight="bold" color={theme.colors.onSurface}>
              {header?.title}
            </Text>
            <Text color={theme.colors.onSurface} style={{ marginTop: theme.spacing.sm }}>
              {header?.description}
            </Text>
          </View>
        </ImageBackground>
      ) : null}

      {isOffline ? (
        <Card>
          <Text color={theme.colors.textSecondary}>{t('common.offline')}</Text>
        </Card>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.xxl
      }}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <Card
          elevated
          onPress={() =>
            navigation.navigate('Article', {
              editoriaSlug: item.editoriaSlug,
              articleSlug: item.slug,
              title: item.title
            })
          }
        >
          <Text variant="subtitle" weight="bold">
            {item.title}
          </Text>
          <Text style={{ marginTop: theme.spacing.xs }} color={theme.colors.textSecondary}>
            {item.excerpt}
          </Text>
          <View
            style={{
              marginTop: theme.spacing.sm,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text color={theme.colors.textSecondary}>{item.author}</Text>
            <Button
              variant="ghost"
              title={t('common.share')}
              onPress={() => shareArticle(item.slug, item.title)}
            />
          </View>
        </Card>
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => refetch()}
          tintColor={theme.colors.primary}
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ padding: theme.spacing.lg }}>
            <Loading />
          </View>
        ) : null
      }
    />
  );
};
