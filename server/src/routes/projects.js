const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Obter todos os projetos
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter um projeto específico
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo projeto (protegido)
router.post('/', auth, async (req, res) => {
  const { title, description, tech_stack, image_url, github_url, demo_url } = req.body;
  
  try {
    const { rows } = await db.query(
      'INSERT INTO projects (title, description, tech_stack, image_url, github_url, demo_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, tech_stack, image_url, github_url, demo_url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar um projeto (protegido)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, tech_stack, image_url, github_url, demo_url } = req.body;
  
  try {
    const { rows } = await db.query(
      'UPDATE projects SET title = $1, description = $2, tech_stack = $3, image_url = $4, github_url = $5, demo_url = $6 WHERE id = $7 RETURNING *',
      [title, description, tech_stack, image_url, github_url, demo_url, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir um projeto (protegido)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json({ message: 'Projeto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 