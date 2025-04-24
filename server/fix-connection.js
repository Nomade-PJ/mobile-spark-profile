const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('=== CORREÇÃO DE CONFIGURAÇÕES DE CONEXÃO ===');

async function main() {
  try {
    // Valores fixos conforme solicitado
    const dbHost = 'localhost';
    const dbPort = 5432;
    const dbUser = 'postgres';
    const dbPassword = 'carlos24h';
    const dbName = 'portfolio';
    
    // 1. Verificar/criar arquivo .env
    const envPath = path.join(__dirname, '.env');
    console.log('\n1. Verificando arquivo .env...');
    
    const envContent = `# Configurações do Banco de Dados
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# Configurações do Servidor
PORT=8080
SESSION_SECRET=sparkprofilesecret123
CORS_ORIGIN=http://localhost:8080
`;
    
    if (fs.existsSync(envPath)) {
      console.log('  O arquivo .env já existe. Atualizando configurações...');
      fs.writeFileSync(envPath, envContent);
      console.log('  Arquivo .env atualizado com sucesso!');
    } else {
      console.log('  Criando arquivo .env com as configurações padrão...');
      fs.writeFileSync(envPath, envContent);
      console.log('  Arquivo .env criado com sucesso!');
    }
    
    // 2. Verificar configuração CORS no index.js
    console.log('\n2. Verificando configuração CORS...');
    const indexPath = path.join(__dirname, 'src', 'index.js');
    
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Atualizar a origem CORS para http://localhost:8080
      if (indexContent.includes("origin:")) {
        const regex = /origin:\s*['"][^'"]*['"]/;
        if (regex.test(indexContent)) {
          console.log('  Atualizando configuração CORS para http://localhost:8080...');
          indexContent = indexContent.replace(
            regex, 
            "origin: 'http://localhost:8080'"
          );
          fs.writeFileSync(indexPath, indexContent);
          console.log('  Configuração CORS atualizada com sucesso!');
        }
      } else {
        console.log('  Não foi possível identificar a configuração CORS atual.');
      }
    } else {
      console.log('  Arquivo index.js não encontrado em src/index.js.');
    }
    
    // 3. Testar conexão com o banco de dados
    console.log('\n3. Testando conexão com o banco de dados...');
    
    // Conexão com o banco postgres para verificar existência do banco portfolio
    const pgPool = new Pool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: 'postgres'
    });
    
    // Testar a conexão primeiro
    try {
      await pgPool.query('SELECT NOW()');
      console.log('  Conexão com PostgreSQL estabelecida com sucesso!');
      
      // Verificar se o banco portfolio existe
      const { rows } = await pgPool.query(`
        SELECT datname FROM pg_database WHERE datname = '${dbName}'
      `);
      
      if (rows.length === 0) {
        console.log(`  Banco de dados "${dbName}" não encontrado. Criando...`);
        await pgPool.query(`CREATE DATABASE ${dbName}`);
        console.log(`  Banco de dados "${dbName}" criado com sucesso!`);
      } else {
        console.log(`  Banco de dados "${dbName}" já existe.`);
      }
      
      // Fechar a conexão com postgres
      await pgPool.end();
      
      // Conexão com o banco portfolio
      const appPool = new Pool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbName
      });
      
      try {
        // Verificar conexão com o banco portfolio
        await appPool.query('SELECT NOW()');
        console.log(`  Conexão com o banco "${dbName}" estabelecida com sucesso!`);
        
        // Verificar se a tabela users existe
        const { rows: usersTable } = await appPool.query(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'users'
        `);
        
        if (usersTable.length === 0) {
          console.log('  Tabela "users" não encontrada! É necessário executar script de migração.');
        } else {
          console.log('  Tabela "users" encontrada.');
          
          // Verificar tabela de sessões
          const { rows: sessionsTable } = await appPool.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'sessions'
          `);
          
          if (sessionsTable.length === 0) {
            console.log('  Criando tabela "sessions"...');
            await appPool.query(`
              CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                token TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                CONSTRAINT unique_active_user_session UNIQUE (user_id, token)
              )
            `);
            console.log('  Tabela "sessions" criada com sucesso!');
          } else {
            console.log('  Tabela "sessions" já existe.');
          }
        }
        
        // Fechar a conexão
        await appPool.end();
        
      } catch (err) {
        console.error(`  Erro ao conectar com o banco "${dbName}":`, err.message);
      }
      
    } catch (err) {
      console.error('  Erro ao conectar com PostgreSQL:', err.message);
      console.log('\n  Por favor, verifique:');
      console.log('  1. Se o PostgreSQL está instalado e em execução');
      console.log('  2. Se as credenciais estão corretas (usuário: postgres, senha: carlos24h)');
      console.log('  3. Se o usuário tem permissão para criar bancos de dados');
    }
    
    console.log('\n=== CONFIGURAÇÃO CONCLUÍDA ===');
    console.log(`
Próximos passos:
1. Reinicie o servidor: npm start
2. Tente fazer login com:
   - Email: pynomade@gmail.com
   - Senha: admin123
3. Se o login falhar, execute: node atualizar-admin.js
    `);
    
  } catch (err) {
    console.error('Erro fatal:', err);
  }
}

// Executar o programa principal
main(); 