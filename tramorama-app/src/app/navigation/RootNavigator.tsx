import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import AboutScreen from '@app/screens/AboutScreen';
import ArticleScreen from '@app/screens/ArticleScreen';
import EditoriaScreen from '@app/screens/EditoriaScreen';
import HomeScreen from '@app/screens/HomeScreen';
import LoginScreen from '@app/screens/LoginScreen';
import RegisterScreen from '@app/screens/RegisterScreen';
import SectionsScreen from '@app/screens/SectionsScreen';
import { useAppTheme } from '@core/theme';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600'
        },
        contentStyle: {
          backgroundColor: theme.colors.background
        }
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('navigation.home') }}
      />
      <Stack.Screen
        name="Sections"
        component={SectionsScreen}
        options={{ title: t('navigation.sections') }}
      />
      <Stack.Screen
        name="Editoria"
        component={EditoriaScreen}
        options={({ route }) => ({ title: route.params.title ?? t('navigation.sections') })}
      />
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({ title: route.params.title ?? t('article.title') })}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: t('navigation.about') }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: t('navigation.login') }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t('navigation.register') }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
