import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  'pt-BR': {
    translation: {
      common: {
        retry: 'Tentar novamente',
        loading: 'Carregando...',
        offline: 'Você está offline. Mostrando dados salvos.',
        share: 'Compartilhar',
        genericError: 'Ops! Algo saiu do plano.',
        favorites: 'Favoritos',
        addFavorite: 'Favoritar',
        removeFavorite: 'Remover favorito',
        history: 'Histórico',
        clear: 'Limpar',
        logout: 'Sair',
        login: 'Entrar',
        register: 'Cadastrar',
        email: 'E-mail',
        password: 'Senha',
        name: 'Nome',
        confirmPassword: 'Confirmar Senha',
        emptyList: 'Nada por aqui ainda.'
      },
      home: {
        heroCta: 'Explorar matérias',
        aboutTitle: 'Quem Somos',
        editoriasTitle: 'Editorias',
        latestPosts: 'Últimas publicações'
      },
      editoria: {
        readMore: 'Ler artigo',
        header: 'Editoria'
      },
      article: {
        author: 'Por {{author}}',
        views: '{{value}} visualizações'
      },
      auth: {
        loginTitle: 'Acesse sua conta',
        registerTitle: 'Crie sua conta',
        forgotPassword: 'Esqueci minha senha',
        passwordMismatch: 'As senhas precisam ser iguais.'
      },
      profile: {
        title: 'Minha Jornada',
        favoritesEmpty: 'Você ainda não favoritou nenhum artigo.',
        historyEmpty: 'Nenhum artigo lido por aqui ainda.',
        loginPrompt: 'Para acessar seus favoritos e histórico, entre ou crie uma conta.'
      }
    }
  }
};

const getDefaultLanguage = () => Localization.getLocales()?.[0]?.languageTag ?? 'pt-BR';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
