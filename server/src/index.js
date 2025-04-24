const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // URL do frontend
  credentials: true, // Permite enviar cookies entre domínios
}));
app.use(express.json());
app.use(cookieParser()); // Para processar cookies

// Importar rotas
const sectionsRoutes = require('./routes/sections');
const projectsRoutes = require('./routes/projects');
const contactsRoutes = require('./routes/contacts');
const navbarRoutes = require('./routes/navbar');
const authRoutes = require('./routes/auth');

// Usar rotas
app.use('/api/sections', sectionsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Portfólio funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 