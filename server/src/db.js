const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Criar tabela de sessões se não existir
const createSessionsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        CONSTRAINT unique_active_user_session UNIQUE (user_id, token)
      )
    `);
    console.log('Tabela de sessões verificada/criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela de sessões:', error);
  }
};

// Inicializar tabelas necessárias
const initDatabase = async () => {
  await createSessionsTable();
};

// Executar inicialização quando o servidor iniciar
initDatabase().catch(console.error);

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 