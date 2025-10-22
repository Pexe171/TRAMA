import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import TramoramaApp from '@app/TramoramaApp';
import { persistOptions, queryClient } from '@core/config/queryClient';
import '@i18n';

const App: React.FC = () => {
  const [isPersistenceReady, setIsPersistenceReady] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
        onSuccess={() => setIsPersistenceReady(true)}
      >
        <SafeAreaProvider>
          {isPersistenceReady ? (
            <TramoramaApp />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
