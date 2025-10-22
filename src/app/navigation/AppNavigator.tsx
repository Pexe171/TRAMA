import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../../core/theme';
import { ArticleScreen } from '../screens/ArticleScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { EditoriaScreen } from '../screens/EditoriaScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerShadowVisible: false,
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold
        },
        contentStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Editoria"
        component={EditoriaScreen}
        options={({ route }) => ({ title: route.params.title ?? 'Editoria' })}
      />
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({ title: route.params.title ?? 'Artigo' })}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ presentation: 'modal', title: 'Entrar' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  );
};
