const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    // Verificar token no cabeçalho Authorization
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      // Obter do cabeçalho primeiro (para compatibilidade)
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.auth_token) {
      // Obter do cookie
      token = req.cookies.auth_token;
    }
    
    if (!token) {
      return res.status(401).json({
        message: 'Autenticação falhou - Token não fornecido'
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o token está na tabela de sessões
    const sessionQuery = await db.query(
      'SELECT * FROM sessions WHERE user_id = $1 AND token = $2 AND expires_at > NOW()',
      [decoded.userId, token]
    );
    
    if (sessionQuery.rows.length === 0) {
      return res.status(401).json({
        message: 'Sessão expirada ou inválida'
      });
    }

    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Autenticação falhou'
    });
  }
}; 