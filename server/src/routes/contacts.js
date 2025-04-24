const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Obter todos os contatos
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM contacts');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um contato específico
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM contacts WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo contato (protegido)
router.post('/', auth, async (req, res) => {
  const { type, label, value, link } = req.body;
  
  try {
    const { rows } = await db.query(
      'INSERT INTO contacts (type, label, value, link) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, label, value, link]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um contato (protegido)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { type, label, value, link } = req.body;
  
  try {
    const { rows } = await db.query(
      'UPDATE contacts SET type = $1, label = $2, value = $3, link = $4 WHERE id = $5 RETURNING *',
      [type, label, value, link, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir um contato (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    
    res.json({ message: 'Contato excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 