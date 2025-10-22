# Tramorama

Aplicativo mobile oficial do portal Trama, desenvolvido em React Native com Expo e TypeScript. O projeto segue uma arquitetura modular em camadas, com foco em experiência fluida, suporte a modo escuro e cache offline básico através do React Query com persistência no AsyncStorage.

## Principais recursos

- Navegação com React Navigation (stack navigator) e integração com o tema do app.
- Estado global com Zustand para preferências (tema) e autenticação.
- Cliente HTTP baseado em Axios com interceptador JWT e integração ao armazenamento seguro.
- Internacionalização com i18next e suporte inicial a PT-BR e EN-US.
- Suporte a modo escuro automático, com persistência da preferência de tema.
- Cache offline simples utilizando React Query + AsyncStorage, além de banner informando ausência de conexão.
- Testes com Jest + Testing Library e linting via ESLint + Prettier.

## Requisitos

- Node.js LTS
- Expo CLI (`npm install -g expo-cli`, opcional)

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste a URL base da API:

   ```bash
   cp .env.example .env
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o app:

   ```bash
   npm run start
   ```

4. Execute os testes:

   ```bash
   npm test
   ```

5. Execute o lint:

   ```bash
   npm run lint
   ```

## Estrutura

```
src/
 ├─ app/             # Navegação, telas e componentes de UI
 ├─ features/        # Casos de uso organizados por domínio (ex.: auth)
 ├─ services/        # Comunicação com API e storage seguro
 ├─ core/            # Configurações, tema, hooks e utilidades compartilhadas
 └─ i18n/            # Arquivos de tradução e configuração do i18next
```

## Variáveis de ambiente

| Variável        | Descrição                                 |
| --------------- | ----------------------------------------- |
| `API_BASE_URL`  | URL base da API REST do portal Trama.     |

## Scripts úteis

| Comando             | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `npm run start`     | Inicia o Metro bundler via Expo.           |
| `npm run android`   | Compila e abre o app no Android.           |
| `npm run ios`       | Compila e abre o app no iOS.               |
| `npm run web`       | Abre a versão web (experimental) no Expo.  |
| `npm run lint`      | Executa o ESLint com as regras definidas.  |
| `npm run typecheck` | Roda o TypeScript em modo somente verificação. |
| `npm run test`      | Executa a suíte de testes com Jest.        |

## Próximos passos sugeridos

- Conectar os fluxos de login/cadastro a telas específicas do design system da Trama.
- Implementar visualização rica de artigos (Markdown/HTML).
- Adicionar armazenamento local dos dados do usuário autenticado.
- Expandir cobertura de testes, incluindo hooks e telas principais.
