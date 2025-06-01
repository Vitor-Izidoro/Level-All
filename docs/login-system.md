# Sistema de Login - Level All

Este documento explica como usar o sistema de autenticação da plataforma Level All.

## Visão Geral

O sistema de login implementado permite que usuários de diferentes tipos (gamer, developer, investor, admin) se autentiquem na plataforma usando suas credenciais. O sistema utiliza JSON Web Tokens (JWT) para manter a sessão do usuário entre requisições.

## Como Usar

### Login

1. Acesse a página de login através do botão "Entrar" na página inicial
2. Escolha seu tipo de usuário (gamer, developer, investor ou admin)
3. Digite seu nome de usuário e senha
4. Clique no botão "Entrar"

### Logout

1. Vá até a página de perfil acessando o menu lateral ou clicando no seu nome no canto superior direito
2. Clique no botão "Sair" na página de perfil

## Rotas Protegidas

As seguintes rotas exigem autenticação:

- `/explorar`
- `/tags`
- `/mensagens`
- `/notificacoes`
- `/perfil`
- `/comunidades`

Se tentar acessá-las sem estar autenticado, você será redirecionado para a página de login.

## Usuários de Teste

Você pode usar os seguintes usuários para testar o sistema:

### Gamer
- Username: shadowwolf01
- Senha: senha123

### Developer
- Username: bruno.ribeiro
- Senha: forgeTech24

### Investor
- Username: mpereira
- Senha: eqgroup01

### Admin
- Username: alemsecco
- Senha: aleadmin

## Estrutura do Token

O token JWT contém as seguintes informações:

- `id`: ID do usuário
- `username`: Nome de usuário
- `userType`: Tipo do usuário (gamer, developer, investor, admin)
- `exp`: Data de expiração do token

## Solução de Problemas

Se encontrar dificuldades ao fazer login, verifique:

1. Se o servidor backend está rodando
2. Se você está usando o tipo de usuário correto
3. Se as credenciais estão corretas

Em caso de problemas persistentes, verifique o console do navegador para erros específicos.
