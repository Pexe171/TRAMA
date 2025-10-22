import React from 'react';
import { Image, ImageBackground, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../core/theme';
import { Button, Card, ErrorState, Loading, Text } from '../components';
import { useEditorias } from '../../features/editoria/hooks/useEditorias';
import { useHome } from '../../features/home/hooks/useHome';
import { RootStackParamList } from '../navigation/types';

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isOffline } = useHome();
  const {
    data: editorias,
    error: editoriasError,
    refetch: refetchEditorias
  } = useEditorias();

  const showLoading = isLoading && !data;
  const showError = (error || editoriasError) && !data;

  const hero = data?.hero;
  const about = data?.about;
  const latestPosts = data?.latestArticles ?? [];

  const handleExplore = () => {
    if (editorias && editorias.length > 0) {
      navigation.navigate('Editoria', {
        slug: editorias[0].slug,
        title: editorias[0].title
      });
    }
  };

  if (showLoading) {
    return <Loading label={t('common.loading')} />;
  }

  if (showError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.lg }}>
        <ErrorState
          title={t('common.genericError')}
          actionLabel={t('common.retry')}
          onRetry={() => {
            refetch();
            refetchEditorias();
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: theme.spacing.xxl,
        gap: theme.spacing.xl
      }}
    >
      {hero ? (
        <ImageBackground
          source={{ uri: hero.imageUrl }}
          resizeMode="cover"
          style={{
            paddingVertical: theme.spacing.xl,
            paddingHorizontal: theme.spacing.lg,
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.overlay,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg
            }}
          >
            <Text variant="overline" color={theme.colors.onSurface}>
              Trama
            </Text>
            <Text variant="title" weight="bold" color={theme.colors.onSurface}>
              {hero.title}
            </Text>
            <Text color={theme.colors.onSurface} style={{ marginTop: theme.spacing.sm }}>
              {hero.subtitle}
            </Text>
            <Button
              title={t('home.heroCta')}
              style={{ marginTop: theme.spacing.md }}
              onPress={handleExplore}
            />
          </View>
        </ImageBackground>
      ) : null}

      {isOffline ? (
        <Card>
          <Text color={theme.colors.textSecondary}>{t('common.offline')}</Text>
        </Card>
      ) : null}

      {about ? (
        <Card>
          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing.md,
              alignItems: 'center'
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="subtitle" weight="bold">
                {t('home.aboutTitle')}
              </Text>
              <Text style={{ marginTop: theme.spacing.sm }} color={theme.colors.textSecondary}>
                {about.description}
              </Text>
            </View>
            <Image
              accessibilityIgnoresInvertColors
              source={{ uri: about.imageUrl }}
              style={{
                width: 96,
                height: 96,
                borderRadius: theme.radius.md
              }}
            />
          </View>
        </Card>
      ) : null}

      <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text variant="subtitle" weight="bold">
          {t('home.editoriasTitle')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            {(editorias ?? []).map((editoria) => (
              <Card
                key={editoria.slug}
                style={{ width: 220 }}
                onPress={() =>
                  navigation.navigate('Editoria', {
                    slug: editoria.slug,
                    title: editoria.title
                  })
                }
              >
                <Text variant="subtitle" weight="bold">
                  {editoria.title}
                </Text>
                <Text style={{ marginTop: theme.spacing.sm }} color={theme.colors.textSecondary}>
                  {editoria.description}
                </Text>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.md }}>
        <Text variant="subtitle" weight="bold">
          {t('home.latestPosts')}
        </Text>
        <View style={{ gap: theme.spacing.md }}>
          {latestPosts.map((article) => (
            <Card
              key={article.id}
              elevated
              onPress={() =>
                navigation.navigate('Article', {
                  editoriaSlug: article.editoriaSlug,
                  articleSlug: article.slug,
                  title: article.title
                })
              }
            >
              <Text variant="subtitle" weight="bold">
                {article.title}
              </Text>
              <Text color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.xs }}>
                {article.excerpt}
              </Text>
              <Text color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
                {article.author} · {article.editoriaTitle}
              </Text>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
