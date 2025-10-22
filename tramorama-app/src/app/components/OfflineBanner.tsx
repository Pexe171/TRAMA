import React from 'react';
import { Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@core/theme';

const OfflineBanner: React.FC = () => {
  const netInfo = useNetInfo();
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const isOffline =
    netInfo.isConnected === false || netInfo.isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.warning,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg
      }}
    >
      <Text style={{ color: theme.colors.background, fontWeight: '700' }}>
        {t('offline.title')}
      </Text>
      <Text style={{ color: theme.colors.background, marginTop: theme.spacing.xs }}>
        {t('offline.description')}
      </Text>
    </View>
  );
};

export default OfflineBanner;
