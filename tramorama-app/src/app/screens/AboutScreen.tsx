import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@services/api/apiClient';
import { useAppTheme } from '@core/theme';

const AboutScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch, isError } = useQuery({
    queryKey: ['about'],
    queryFn: api.getAbout
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
          <Text style={{ color: theme.colors.text, marginTop: theme.spacing.md }}>
            {data.content}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default AboutScreen;
