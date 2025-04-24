const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configurações de conexão do .env
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

// Banco de destino
const dbName = process.env.DB_NAME || 'portfolio';

// Tabelas para migrar e remover
const tabelas = ['users', 'sections', 'projects', 'contacts', 'navbar_items'];

// Função principal
async function migrarELimpar() {
  console.log('=== INICIANDO MIGRAÇÃO E LIMPEZA DE TABELAS ===');
  
  try {
    // Conectar ao banco postgres
    const clienteOrigem = new Pool({
      ...config,
      database: 'postgres'
    });
    
    // Conectar ao banco portfolio/destino
    const clienteDestino = new Pool({
      ...config, 
      database: dbName
    });
    
    // Testar conexões
    try {
      await clienteOrigem.query('SELECT 1');
      await clienteDestino.query('SELECT 1');
      console.log('Conexões estabelecidas com sucesso.');
    } catch (err) {
      console.error('Erro ao conectar aos bancos de dados:', err.message);
      return;
    }
    
    // 1. Para cada tabela
    for (const tabela of tabelas) {
      console.log(`\n--- Processando tabela: ${tabela} ---`);
      
      // Verificar se a tabela existe na origem
      const { rows: tabelaExiste } = await clienteOrigem.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        ) as existe
      `, [tabela]);
      
      if (!tabelaExiste[0].existe) {
        console.log(`Tabela ${tabela} não existe no banco de origem.`);
        continue;
      }
      
      try {
        // 1. Obter estrutura da tabela a partir da origem
        console.log(`Copiando estrutura da tabela ${tabela}...`);
        
        // Obter DDL da tabela (estrutura)
        // Primeiro tentar obter colunas
        const { rows: colunas } = await clienteOrigem.query(`
          SELECT column_name, data_type, 
                 CASE 
                   WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
                   ELSE ''
                 END as length,
                 is_nullable,
                 CASE WHEN column_default LIKE 'nextval%' THEN NULL ELSE column_default END as column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tabela]);
        
        // Remover tabela no destino se já existir
        await clienteDestino.query(`DROP TABLE IF EXISTS ${tabela} CASCADE`);
        
        // Criar tabela no destino
        let createSQL = `CREATE TABLE ${tabela} (\n`;
        
        // Adicionar colunas
        const colunasSQL = colunas.map(col => {
          let colDef = `  ${col.column_name} ${col.data_type}${col.length}`;
          
          // Se for coluna ID, torná-la serial (auto incremento)
          if (col.column_name === 'id') {
            colDef = `  id SERIAL`;
          } else if (col.is_nullable === 'NO') {
            colDef += ' NOT NULL';
          }
          
          if (col.column_default && !col.column_default.includes('nextval')) {
            colDef += ` DEFAULT ${col.column_default}`;
          }
          
          return colDef;
        }).join(',\n');
        
        createSQL += colunasSQL;
        
        // Adicionar chave primária
        const { rows: pks } = await clienteOrigem.query(`
          SELECT kcu.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
            AND tc.table_name = $1
        `, [tabela]);
        
        if (pks.length > 0) {
          const pkColunas = pks.map(pk => pk.column_name).join(', ');
          createSQL += `,\n  PRIMARY KEY (${pkColunas})`;
        }
        
        createSQL += '\n);';
        
        // Executar a criação da tabela
        await clienteDestino.query(createSQL);
        console.log(`Tabela ${tabela} criada no banco de destino.`);
        
        // 2. Copiar dados
        const { rows: dados } = await clienteOrigem.query(`SELECT * FROM ${tabela}`);
        console.log(`Copiando ${dados.length} registros...`);
        
        if (dados.length > 0) {
          // Começar transação
          const client = await clienteDestino.connect();
          
          try {
            await client.query('BEGIN');
            
            // Inserir cada linha de dados
            for (const row of dados) {
              const colunas = Object.keys(row);
              const colunasList = colunas.join(', ');
              const valoresPlaceholders = colunas.map((_, i) => `$${i + 1}`).join(', ');
              const valores = Object.values(row);
              
              await client.query(
                `INSERT INTO ${tabela} (${colunasList}) VALUES (${valoresPlaceholders})`,
                valores
              );
            }
            
            // Atualizar sequência do id se existir
            if (pks.length > 0 && pks[0].column_name === 'id') {
              await client.query(`
                SELECT setval(pg_get_serial_sequence('${tabela}', 'id'), 
                             COALESCE((SELECT MAX(id) FROM ${tabela}), 1), 
                             (SELECT MAX(id) FROM ${tabela}) IS NOT NULL)
              `);
            }
            
            await client.query('COMMIT');
            console.log(`Dados da tabela ${tabela} copiados com sucesso.`);
          } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Erro ao copiar dados: ${err.message}`);
          } finally {
            client.release();
          }
        }
        
        // 3. Remover tabela da origem
        console.log(`Removendo tabela ${tabela} do banco de origem...`);
        await clienteOrigem.query(`DROP TABLE IF EXISTS ${tabela} CASCADE`);
        console.log(`Tabela ${tabela} removida do banco de origem.`);
        
      } catch (err) {
        console.error(`Erro ao processar tabela ${tabela}: ${err.message}`);
      }
    }
    
    // Fechar conexões
    await clienteOrigem.end();
    await clienteDestino.end();
    
    console.log('\n=== PROCESSO CONCLUÍDO ===');
    
  } catch (err) {
    console.error('Erro fatal:', err);
  }
}

// Executar o programa
migrarELimpar(); 