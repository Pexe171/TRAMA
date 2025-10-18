# Frontend TRAMA

Este projeto foi criado com [Create React App](https://github.com/facebook/create-react-app) e concentra toda a camada de interface dentro da pasta `client`.

## Scripts disponíveis

Na pasta `client`, execute:

### `npm install`

Instala as dependências do frontend.

### `npm start`

Inicia o servidor de desenvolvimento em [http://localhost:3000](http://localhost:3000).

### `npm run build`

Gera os arquivos otimizados de produção dentro da pasta `client/build`.

### `npm test`

Executa a suíte de testes configurada pelo Create React App.

## Estrutura principal

- `public/`: arquivos estáticos que serão servidos tal como estão.
- `src/`: código-fonte React.

Para publicar o frontend junto com o backend Express, gere o build de produção com `npm run build`. O servidor reconhece automaticamente a pasta `client/build` quando ela existir.
