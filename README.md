# Level-All

Level-All é uma plataforma de rede social projetada para conectar gamers, desenvolvedores e investidores da indústria de jogos. A aplicação permite networking, compartilhamento de conteúdo e colaboração entre os diferentes perfis de usuários.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos de Sistema](#requisitos-de-sistema)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Contribuição](#contribuição)

## 🔭 Visão Geral

Level-All é uma plataforma de mídia social especializada no setor de games que conecta três tipos principais de usuários:

- **Gamers**: Jogadores que buscam comunidades, conteúdo e networking com outros entusiastas de jogos
- **Desenvolvedores**: Profissionais de desenvolvimento de games que desejam compartilhar seu trabalho e conectar-se com potenciais colaboradores ou investidores
- **Investidores**: Empresas ou indivíduos interessados em investir em projetos de games promissores

A plataforma oferece uma experiência de usuário moderna e responsiva, com um design intuitivo e amigável.

## ✨ Funcionalidades

### Gerais
- Feed de conteúdo personalizado
- Sistema de perfil de usuário com diferentes tipos de conta
- Sistema de pesquisa
- Modo claro/escuro

### Social
- Publicações no feed com suporte a texto e imagens
- Sistema de mensagens privadas e em grupo
- Sistema de notificações
- Comunidades temáticas

### Específicas por tipo de usuário
- **Gamers**: Sistema de níveis e pontuação, listagem de jogos favoritos
- **Desenvolvedores**: Portfólio de projetos, informações de empresa e cargo
- **Investidores**: Perfil empresarial com CNPJ, informações de contato

### Administrativas
- Painel de gerenciamento de usuários para administradores
- CRUD de usuários por tipo (gamer, developer, investor, admin)

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js
- React Router
- CSS puro e TailwindCSS
- Axios para requisições HTTP

### Backend
- Node.js
- Express.js
- MySQL (com mysql2)
- Multer para upload de arquivos

### Desenvolvimento
- dotenv para variáveis de ambiente
- Nodemon para desenvolvimento backend

## 📁 Estrutura do Projeto

```
Level-All/
├── backend/             # API e servidor backend
│   ├── config/          # Configurações do backend
│   ├── uploads/         # Diretório de uploads de mídia
│   ├── index.js         # Ponto de entrada do servidor
│   └── package.json     # Dependências do backend
│
├── db/                  # Scripts SQL e migrações
│
└── frontend/            # Interface de usuário React
    └── reactproject/    # Projeto React
        ├── public/      # Arquivos públicos e estáticos
        │   └── logo.jpeg # Logo da aplicação
        └── src/         # Código fonte React
            ├── components/  # Componentes React
            │   ├── chat/    # Componentes do sistema de chat
            │   └── ...      # Demais componentes
            ├── config/      # Configurações do frontend
            ├── App.jsx      # Componente principal
            └── index.jsx    # Ponto de entrada do React
```

## 🖥️ Requisitos de Sistema

- Node.js (v14.0.0 ou superior)
- MySQL (v8.0 ou superior)
- NPM ou Yarn (gerenciador de pacotes)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## ⚙️ Instalação e Configuração

### Pré-requisitos
1. Instalar Node.js e npm: [https://nodejs.org/](https://nodejs.org/)
2. Instalar MySQL: [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

### Backend
1. Clonar o repositório
2. Navegar para a pasta backend:
```bash
cd Level-All/backend
```

3. Instalar as dependências:
```bash
npm install
```

4. Configurar o arquivo `.env` na raiz da pasta backend:
```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=level_all
DB_PORT=3306
```

5. Importar o banco de dados:
```bash
mysql -u seu_usuario -p level_all < ../db/LEVEL_ALL_SQL_EXPORT.sql
```

6. Iniciar o servidor:
```bash
npm run dev
```

### Frontend
1. Navegar para a pasta frontend:
```bash
cd ../frontend/reactproject
```

2. Instalar as dependências:
```bash
npm install
```

3. Iniciar a aplicação React:
```bash
npm start
```

## 🚀 Uso

Após instalar e configurar o projeto, acesse:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Tipos de Usuários
1. **Gamer**: Registre-se como jogador para explorar comunidades e conectar-se com outros usuários
2. **Developer**: Crie um perfil de desenvolvedor para mostrar seus projetos e conectar-se com investidores
3. **Investor**: Crie um perfil de investidor para descobrir projetos promissores
4. **Admin**: Gerencie usuários e conteúdo da plataforma (acesso restrito)

## 📡 API Endpoints

### Usuários
- `GET /` - Listar todos os usuários
- `GET /user/:username` - Obter usuário específico
- `POST /user_gamer` - Criar usuário gamer
- `POST /user_developer` - Criar usuário desenvolvedor
- `POST /user_investor` - Criar usuário investidor
- `POST /user_admin` - Criar usuário administrador
- `PUT /user_gamer/:username` - Atualizar usuário gamer
- `PUT /user_developer/:username` - Atualizar usuário desenvolvedor
- `PUT /user_investor/:username` - Atualizar usuário investidor
- `PUT /user_admin/:username` - Atualizar usuário administrador
- `DELETE /user/:username` - Excluir usuário

### Mensagens e Contatos
- `GET /contacts` - Listar todos os contatos
- `GET /contacts/:id` - Obter contato específico
- `POST /contacts` - Criar novo contato
- `PUT /contacts/:id` - Atualizar contato
- `DELETE /contacts/:id` - Excluir contato
- `GET /messages` - Listar todas as mensagens
- `GET /messages/:id` - Obter mensagem específica
- `POST /messages` - Criar nova mensagem
- `PUT /messages/:id` - Atualizar mensagem
- `DELETE /messages/:id` - Excluir mensagem

### Posts e Uploads
- `GET /posts` - Listar todos os posts
- `POST /posts` - Criar novo post (suporta uploads de imagens)