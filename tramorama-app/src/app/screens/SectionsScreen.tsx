import React from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '@services/api/apiClient';
import { Editoria } from '@services/api/types';
import { useAppTheme } from '@core/theme';

import { RootStackParamList } from '@app/navigation/types';

const SectionsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const { data, isLoading, refetch, isRefetching, isError } = useQuery({
    queryKey: ['editorias'],
    queryFn: api.getEditorias
  });

  const renderItem = ({ item }: { item: Editoria }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Editoria', {
          slug: item.slug,
          title: item.name
        })
      }
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
        {item.name}
      </Text>
      {item.description ? (
        <Text style={{ color: theme.colors.muted, marginTop: theme.spacing.xs }}>
          {item.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.lg }}
      data={data ?? []}
      keyExtractor={(item) => item.slug}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isRefetching}
          tintColor={theme.colors.primary}
          onRefresh={() => {
            void refetch();
          }}
        />
      }
      ListEmptyComponent={
        isError ? (
          <Text style={{ color: theme.colors.danger }}>{t('errors.generic')}</Text>
        ) : (
          <Text style={{ color: theme.colors.muted }}>{t('errors.generic')}</Text>
        )
      }
    />
  );
};

export default SectionsScreen;
