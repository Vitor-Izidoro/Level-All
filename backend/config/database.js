import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do banco de dados com valores padrão caso não haja variáveis de ambiente
const dbConfig = {
  host: process.env.DB_HOST || "nome",
  user: process.env.DB_USER || "nome",
  password: process.env.DB_PASSWORD || "nome",
  database: process.env.DB_NAME || "nome",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Tentando conectar ao banco de dados com configuração:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Criação do pool de conexões
const pool = mysql.createPool(dbConfig);

// Teste inicial para verificar a conexão
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    console.error('Por favor, verifique se o servidor MySQL está em execução e se as credenciais estão corretas.');
  }
})();

export default pool;