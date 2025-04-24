const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Obter todas as seções
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM sections WHERE is_active = true');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma seção específica por nome
router.get('/:name', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM sections WHERE name = $1', [req.params.name]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Seção não encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar uma nova seção (protegido)
router.post('/', auth, async (req, res) => {
  const { name, content, is_active } = req.body;
  
  try {
    const { rows } = await db.query(
      'INSERT INTO sections (name, content, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name, content, is_active || true]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar uma seção (protegido)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, content, is_active } = req.body;
  
  try {
    const { rows } = await db.query(
      'UPDATE sections SET name = $1, content = $2, is_active = $3 WHERE id = $4 RETURNING *',
      [name, content, is_active, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Seção não encontrada' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir uma seção (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM sections WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Seção não encontrada' });
    }
    
    res.json({ message: 'Seção excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 