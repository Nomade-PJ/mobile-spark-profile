/**
 * Configurações da aplicação
 * Usa variáveis de ambiente do Vite para determinar o ambiente
 */

const API_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : import.meta.env.PROD 
    ? 'https://api.seu-dominio.com' 
    : 'http://localhost:3001';

export default {
  API_URL
}; 