# Unews Frontend

Este é o repositório do frontend do projeto Unews, desenvolvido com Next.js.

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. Clone o repositório:
    ```bash
    git clone https://github.com/oaleekis/unews-frontend.git
    cd unews-frontend
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Duplique o arquivo `.env.example` e renomeie para `.env.local`:
    ```bash
    cp .env.example .env.local
    ```

4. Altere as variáveis de ambiente no arquivo `.env.local` conforme necessário. Certifique-se de configurar corretamente as variáveis para conectar ao backend e outros serviços necessários.

## Scripts 

### `npm run start`

Inicia o servidor em produção com o código compilado.

## Backend

O repositório do backend pode ser encontrado em: [Unews Backend](https://github.com/oaleekis/unews-backend). Certifique-se de seguir as instruções no repositório do backend para configurá-lo corretamente.

## Usabilidade

O sistema possui uma tela de dashboard onde cada autor pode criar e gerenciar suas notícias. As funcionalidades incluem:

- **Criação de Notícias**: Autores podem criar novas notícias com título, conteúdo.
- **Gerenciamento de Notícias**: Autores podem editar ou deletar suas notícias. O sistema utiliza soft delete, permitindo a recuperação de notícias deletadas.
- **Paginação**: As telas de listagem de notícias possuem paginação para facilitar a navegação.
- **Autenticação**: Para acessar o dashboard, é necessário criar uma conta e fazer login.

## Telas Principais

- **Dashboard**: Área restrita para autores gerenciarem suas notícias.
- **Tela de Notícias** (`/news`): Exibe todas as notícias de todos os autores, com opções de filtro e busca.
