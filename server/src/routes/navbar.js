const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Obter todos os itens da navbar
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM navbar_items ORDER BY order_index ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter apenas itens visíveis da navbar
router.get('/visible', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM navbar_items WHERE is_visible = true ORDER BY order_index ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um item específico da navbar
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM navbar_items WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item da navbar não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo item da navbar (protegido)
router.post('/', auth, async (req, res) => {
  const { label, icon_name, route, order_index, is_visible } = req.body;
  
  try {
    const { rows } = await db.query(
      'INSERT INTO navbar_items (label, icon_name, route, order_index, is_visible) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [label, icon_name, route, order_index, is_visible]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um item da navbar (protegido)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { label, icon_name, route, order_index, is_visible } = req.body;
  
  try {
    const { rows } = await db.query(
      'UPDATE navbar_items SET label = $1, icon_name = $2, route = $3, order_index = $4, is_visible = $5 WHERE id = $6 RETURNING *',
      [label, icon_name, route, order_index, is_visible, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item da navbar não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir um item da navbar (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM navbar_items WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item da navbar não encontrado' });
    }
    
    res.json({ message: 'Item da navbar excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 