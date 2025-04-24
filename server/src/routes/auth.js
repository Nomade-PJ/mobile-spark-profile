const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');
const cookieParser = require('cookie-parser');

// Middleware para processar cookies
router.use(cookieParser());

// Verificar sessão
router.get('/verify-session', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Nenhuma sessão encontrada' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o usuário existe
    const userQuery = await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar sessão no banco de dados
    const sessionQuery = await db.query('SELECT * FROM sessions WHERE user_id = $1 AND token = $2 AND expires_at > NOW()', 
      [decoded.userId, token]);
    
    if (sessionQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Sessão expirada ou inválida' });
    }
    
    return res.status(200).json({ 
      token,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Sessão inválida' });
  }
});

// Logout - remove a sessão
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    
    if (token) {
      // Remover a sessão do banco de dados
      await db.query('DELETE FROM sessions WHERE token = $1', [token]);
      
      // Limpar o cookie
      res.clearCookie('auth_token');
    }
    
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao realizar logout' });
  }
});

// Registro de usuário (disponível apenas para desenvolvimento inicial)
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    // Verificar se o usuário já existe
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Inserir novo usuário
    const result = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role || 'user']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registro do admin inicial (rota simplificada para setup inicial)
router.post('/setup-admin', async (req, res) => {
  try {
    // Verificar se já existe algum admin
    const checkAdmin = await db.query('SELECT * FROM users WHERE role = $1', ['admin']);
    if (checkAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Um administrador já existe no sistema' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt); // Senha padrão inicial
    
    // Inserir o admin
    const result = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      ['admin@portfolio.com', hashedPassword, 'admin']
    );
    
    res.status(201).json({
      message: 'Administrador criado com sucesso!',
      user: {
        email: 'admin@portfolio.com',
        password: 'admin123' // Apenas para setup inicial, trocar depois de login
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Buscar usuário pelo email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Autenticação falhou' });
    }
    
    const user = result.rows[0];
    
    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Autenticação falhou' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Salvar a sessão no banco de dados
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas de validade
    
    await db.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );
    
    // Configurar cookie com o token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas em milissegundos
      sameSite: 'strict'
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alterar senha (protegido)
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userData.userId;
  
  try {
    // Buscar usuário pelo ID
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const user = result.rows[0];
    
    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Atualizar senha
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 