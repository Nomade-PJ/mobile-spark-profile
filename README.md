# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/474b46aa-d293-41a8-9a3a-52ae57636fa0

## Configuração do Servidor e Banco de Dados

Este projeto utiliza PostgreSQL como banco de dados. Para configurar o ambiente:

1. Certifique-se que o PostgreSQL está instalado e em execução.
2. Na pasta `server`, execute os seguintes scripts:

```sh
# Configurar conexão com o banco de dados:
node fix-connection.js

# Iniciar o servidor:
npm start
```

Para mais detalhes sobre a configuração e solução de problemas, consulte o arquivo [SOLUCAO.md](server/SOLUCAO.md) na pasta server.

### Scripts Disponíveis

O projeto inclui os seguintes scripts utilitários na pasta `server`:

- `fix-connection.js` - Configura o ambiente e conexão com o banco
- `atualizar-admin.js` - Atualiza ou cria o usuário administrador
- `limpar-tabelas.js` - Limpa e recria as tabelas do banco de dados

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/474b46aa-d293-41a8-9a3a-52ae57636fa0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/474b46aa-d293-41a8-9a3a-52ae57636fa0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
