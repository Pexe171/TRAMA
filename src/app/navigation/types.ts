export type RootStackParamList = {
  Home: undefined;
  Editoria: {
    slug: string;
    title?: string;
  };
  Article: {
    editoriaSlug: string;
    articleSlug: string;
    title?: string;
  };
  Auth: {
    mode?: 'login' | 'register';
  } | undefined;
  Profile: undefined;
};
