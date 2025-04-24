const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração para o banco a partir do .env
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'portfolio'
});

// Dados do administrador
const adminData = {
  email: 'pynomade@gmail.com',
  password: 'admin123',
  username: 'nmpj',
  role: 'admin'
};

async function atualizarAdmin() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Verificando tabela users...');
    
    // 1. Verificar colunas da tabela users
    const { rows: colunas } = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    const colunasExistentes = colunas.map(c => c.column_name);
    console.log(`Colunas encontradas: ${colunasExistentes.join(', ')}`);
    
    // 2. Adicionar colunas se necessário
    if (!colunasExistentes.includes('username')) {
      console.log('Adicionando coluna username...');
      await client.query(`ALTER TABLE users ADD COLUMN username VARCHAR(50)`);
    }
    
    if (!colunasExistentes.includes('role')) {
      console.log('Adicionando coluna role...');
      await client.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'`);
    }
    
    // 3. Gerar hash da senha
    console.log('Gerando hash da senha...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminData.password, saltRounds);
    
    // 4. Verificar se o usuário existe
    const { rows: users } = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminData.email]
    );
    
    if (users.length > 0) {
      // Atualizar usuário existente
      console.log(`Atualizando usuário ${adminData.email}...`);
      
      await client.query(`
        UPDATE users 
        SET password_hash = $1, role = $2, username = $3
        WHERE email = $4
      `, [passwordHash, adminData.role, adminData.username, adminData.email]);
      
      console.log('Usuário atualizado com sucesso!');
    } else {
      // Criar novo usuário
      console.log(`Criando novo usuário ${adminData.email}...`);
      
      await client.query(`
        INSERT INTO users (email, password_hash, role, username)
        VALUES ($1, $2, $3, $4)
      `, [adminData.email, passwordHash, adminData.role, adminData.username]);
      
      console.log('Usuário criado com sucesso!');
    }
    
    await client.query('COMMIT');
    
    // 5. Verificar usuário
    const { rows: admin } = await client.query(`
      SELECT * FROM users WHERE email = $1
    `, [adminData.email]);
    
    if (admin.length > 0) {
      console.log('\nConfirmação do usuário administrador:');
      console.log('---------------------------------');
      console.log(`ID: ${admin[0].id}`);
      console.log(`Email: ${admin[0].email}`);
      console.log(`Username: ${admin[0].username || '(não definido)'}`);
      console.log(`Role: ${admin[0].role || '(não definido)'}`);
      console.log(`Password Hash: ${admin[0].password_hash ? '[hash definido]' : '[sem hash]'}`);
      
      console.log('\nCredenciais para login:');
      console.log('---------------------------------');
      console.log(`Email: ${adminData.email}`);
      console.log(`Username: ${adminData.username}`);
      console.log(`Senha: ${adminData.password}`);
    }
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro:', err.message);
  } finally {
    client.release();
    await pool.end();
    console.log('\nProcesso concluído!');
  }
}

// Executar
atualizarAdmin(); 