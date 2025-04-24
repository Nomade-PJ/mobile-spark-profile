# Guia de Migração para Produção

Este documento contém os passos necessários para migrar o projeto do ambiente de desenvolvimento para o ambiente de produção.

## 1. Configuração do arquivo .env

### Corrigir o .env atual antes da migração

O arquivo `.env` atual contém duplicações que precisam ser corrigidas. Execute os seguintes passos:

1. Navegue até a pasta `server`
2. Exclua o arquivo `.env` atual
3. Crie um novo arquivo `.env` com o seguinte conteúdo para desenvolvimento:

```
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=carlos24h
DB_NAME=portfolio

# Configurações do Servidor
PORT=8080
SESSION_SECRET=sparkprofilesecret123
CORS_ORIGIN=http://localhost:8080
JWT_SECRET=sparkprofilesecret123
NODE_ENV=development
```

### Configuração .env para produção

Em produção, crie um novo arquivo `.env` com as seguintes variáveis:

```
# Configurações do Banco de Dados
DB_HOST=seu_host_de_producao
DB_PORT=5432
DB_USER=seu_usuario_db
DB_PASSWORD=sua_senha_segura
DB_NAME=portfolio

# Configurações do Servidor
PORT=8080
SESSION_SECRET=uma_string_secreta_longa_e_aleatoria
CORS_ORIGIN=https://seu-dominio.com
JWT_SECRET=outra_string_secreta_longa_e_aleatoria
NODE_ENV=production
```

## 2. Configuração do Frontend

### Ajustar as URLs de API

Todas as requisições no frontend estão usando URLs hardcoded para `http://localhost:3001`. Foi criado um arquivo de configuração para gerenciar as URLs de API:

1. Use o arquivo criado `src/lib/config.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.PROD 
    ? 'https://api.seu-dominio.com' 
    : 'http://localhost:3001';

export default {
  API_URL
};
```

2. Para o frontend, crie um arquivo `.env.production` na raiz do projeto com:

```
VITE_API_URL=https://api.seu-dominio.com
```

3. Substitua todas as ocorrências de `http://localhost:3001` por `config.API_URL` nos arquivos:
   - src/pages/SetupAdmin.tsx
   - src/pages/Home.tsx (já atualizado como exemplo)
   - src/pages/AdminProfile.tsx
   - src/pages/Admin.tsx
   - src/components/ui/mobile-nav.tsx

## 3. Configurações do Servidor

### Ajustar a configuração CORS

No arquivo `server/src/index.js`, modifique a configuração CORS para usar a variável de ambiente:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
```

### Proteção de rotas administrativas

Certifique-se de que as rotas de administração estão devidamente protegidas:

1. A rota `/setup-admin` só deve estar disponível em desenvolvimento ou ser removida após a configuração inicial
2. Adicione autenticação robusta para todas as rotas administrativas

## 4. Build e Deployment

### Build do Frontend

```bash
# Na raiz do projeto
npm run build
```

### Configuração do Servidor Web

Configure um servidor web (Nginx, Apache) como proxy reverso:

1. Configuração Nginx para o frontend:
```
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    location / {
        root /path/to/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Configure HTTPS usando Let's Encrypt ou outro provedor de certificado SSL:

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### Deploy do servidor Node.js

Você pode usar PM2 para gerenciar o processo Node.js:

```bash
# No diretório server
npm install pm2 -g
pm2 start src/index.js --name "portfolio-api"
pm2 startup
pm2 save
```

## 5. Checklist de Segurança

- [ ] Remover senhas hardcoded e segredos do código
- [ ] Configurar HTTPS
- [ ] Configurar CORS adequadamente
- [ ] Garantir que JWT_SECRET é uma string longa e aleatória
- [ ] Configurar cookies como secure em produção
- [ ] Implementar expiração de sessões
- [ ] Certificar-se de que todas as APIs admin exigem autenticação

## 6. Banco de Dados

- Faça backup do banco de dados de desenvolvimento
```bash
pg_dump -U postgres -h localhost -d portfolio > portfolio_backup.sql
```

- Restaure no servidor de produção
```bash
psql -U postgres -h seu_host_de_producao -d portfolio < portfolio_backup.sql
```

- Configure backups automáticos no servidor de produção
```bash
# Crie um script de backup em /etc/cron.daily/backup-portfolio-db
#!/bin/bash
BACKUP_DIR=/var/backups/postgres
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres -h localhost -d portfolio > $BACKUP_DIR/portfolio_$TIMESTAMP.sql
find $BACKUP_DIR -name "portfolio_*.sql" -mtime +7 -delete
```

- Certifique-se de que o PostgreSQL está configurado com acesso limitado
```
# No arquivo pg_hba.conf
host    portfolio       postgres        127.0.0.1/32            md5
```

## 7. Monitoramento

- Configure logs para capturar erros:
```javascript
// Adicione no servidor
const fs = require('fs');
const path = require('path');

app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${err.stack}\n`;
  
  fs.appendFile(
    path.join(__dirname, 'error.log'),
    logEntry,
    (err) => {
      if (err) console.error('Erro ao escrever no log:', err);
    }
  );
  
  res.status(500).json({ error: 'Erro interno do servidor' });
});
```

- Implemente monitoramento para o servidor Node.js usando PM2:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 8. Testando em Produção

Antes de disponibilizar o site publicamente, teste todas as funcionalidades:

- Login/Logout
- CRUD de projetos
- Contato
- Navegação
- Responsividade em diferentes dispositivos

## 9. Ajustes Finais

- Atualize as senhas do admin após o deploy inicial
- Configure um sistema de redirecionamento para capturar todos os erros 404
- Verifique a velocidade de carregamento com ferramentas como Google PageSpeed
- Configure cache HTTP adequado para recursos estáticos 