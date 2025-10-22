import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Sections: undefined;
  Editoria: { slug: string; title?: string };
  Article: { editoriaSlug: string; articleSlug: string; title?: string };
  About: undefined;
  Login: undefined;
  Register: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
