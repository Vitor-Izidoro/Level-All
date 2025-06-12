// Arquivo para testar a conexão com o banco de dados
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Inicializar ambiente
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Chewie2020!',
  database: process.env.DB_NAME || 'level_all',
  port: process.env.DB_PORT || 3306
};

console.log('🔍 Verificando conexão com o banco de dados MySQL...');
console.log('Configuração:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Tentar conectar sem especificar o banco de dados primeiro
const testServerConnection = async () => {
  try {
    const serverConfig = { ...dbConfig };
    delete serverConfig.database; // Remover o banco de dados para verificar apenas conexão com servidor
    
    console.log('\n1️⃣ Testando conexão com o servidor MySQL (sem especificar banco)...');
    const connection = await mysql.createConnection(serverConfig);
    console.log('✅ Conexão com o servidor MySQL estabelecida!');
    
    // Verificar se o servidor está funcionando
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Servidor MySQL funcionando corretamente. Resultado da consulta:', rows[0]);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao servidor MySQL:', error);
    console.error('❗ Verifique se o servidor MySQL está em execução e se as credenciais estão corretas.');
    return false;
  }
};

// Verificar se o banco de dados existe
const checkDatabaseExists = async () => {
  try {
    const serverConfig = { ...dbConfig };
    delete serverConfig.database;
    
    console.log(`\n2️⃣ Verificando se o banco de dados '${dbConfig.database}' existe...`);
    const connection = await mysql.createConnection(serverConfig);
    
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [dbConfig.database]
    );
    
    if (rows.length > 0) {
      console.log(`✅ O banco de dados '${dbConfig.database}' existe!`);
      await connection.end();
      return true;
    } else {
      console.log(`❌ O banco de dados '${dbConfig.database}' NÃO existe!`);
      
      // Verificar o arquivo SQL para criação do banco
      const sqlFilePath = path.join(__dirname, '..', 'db', 'LEVEL_ALL_POPULADA.sql');
      
      if (fs.existsSync(sqlFilePath)) {
        console.log(`ℹ️ Arquivo SQL encontrado em: ${sqlFilePath}`);
        console.log('ℹ️ Para criar o banco de dados, execute o comando:');
        console.log(`mysql -u ${dbConfig.user} -p < "${sqlFilePath}"`);
      } else {
        console.log('❌ Arquivo SQL não encontrado!');
      }
      
      await connection.end();
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar a existência do banco de dados:', error);
    return false;
  }
};

// Verificar as tabelas no banco de dados
const checkTables = async () => {
  try {
    console.log(`\n3️⃣ Verificando tabelas no banco de dados '${dbConfig.database}'...`);
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.query(
      `SELECT TABLE_NAME 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? 
       AND TABLE_NAME IN ('user_gamer', 'user_developer', 'user_investor', 'user_admin')`, 
      [dbConfig.database]
    );
    
    console.log(`📋 Tabelas encontradas (${rows.length} de 4 esperadas):`);
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.TABLE_NAME}`);
    });
    
    // Verificar se todas as tabelas necessárias existem
    const expectedTables = ['user_gamer', 'user_developer', 'user_investor', 'user_admin'];
    const foundTables = rows.map(row => row.TABLE_NAME);
    
    const missingTables = expectedTables.filter(table => !foundTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Tabelas faltando:', missingTables.join(', '));
    } else {
      console.log('✅ Todas as tabelas necessárias existem!');
    }
    
    await connection.end();
    return rows.length === expectedTables.length;
  } catch (error) {
    console.error('❌ Erro ao verificar as tabelas:', error);
    return false;
  }
};

// Verificar se há registros nas tabelas
const checkRecords = async () => {
  try {
    console.log('\n4️⃣ Verificando registros nas tabelas de usuários...');
    const connection = await mysql.createConnection(dbConfig);
    
    const tables = ['user_gamer', 'user_developer', 'user_investor', 'user_admin'];
    let allTablesHaveRecords = true;
    
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = rows[0].count;
      
      if (count > 0) {
        console.log(`✅ Tabela '${table}' tem ${count} registros.`);
      } else {
        console.log(`⚠️ Tabela '${table}' não tem registros.`);
        allTablesHaveRecords = false;
      }
    }
    
    // Verificar usuário específico para teste de login
    const [testUser] = await connection.query(
      `SELECT * FROM user_gamer WHERE username = 'shadowwolf01'`
    );
    
    if (testUser.length > 0) {
      console.log('✅ Usuário de teste "shadowwolf01" encontrado na tabela user_gamer.');
    } else {
      console.log('❌ Usuário de teste "shadowwolf01" NÃO encontrado na tabela user_gamer.');
      allTablesHaveRecords = false;
    }
    
    await connection.end();
    return allTablesHaveRecords;
  } catch (error) {
    console.error('❌ Erro ao verificar registros:', error);
    return false;
  }
};

// Executar a sequência de testes
const runTests = async () => {
  console.log('🧪 Iniciando diagnóstico do banco de dados...\n');
  
  const serverConnected = await testServerConnection();
  if (!serverConnected) {
    return summarizeResults(false, false, false);
  }
  
  const databaseExists = await checkDatabaseExists();
  if (!databaseExists) {
    return summarizeResults(true, false, false);
  }
  
  const tablesExist = await checkTables();
  const recordsExist = await checkRecords();
  
  return summarizeResults(true, databaseExists, tablesExist, recordsExist);
};

// Resumir resultados
const summarizeResults = (serverOk, dbOk, tablesOk, recordsOk) => {
  console.log('\n📊 RESUMO DO DIAGNÓSTICO:');
  console.log(`- Servidor MySQL: ${serverOk ? '✅ OK' : '❌ FALHA'}`);
  console.log(`- Banco de dados: ${dbOk ? '✅ OK' : '❌ FALHA'}`);
  console.log(`- Tabelas: ${tablesOk ? '✅ OK' : '❌ FALHA'}`);
  console.log(`- Registros: ${recordsOk ? '✅ OK' : '⚠️ ALERTA'}`);
  
  console.log('\n📋 DIAGNÓSTICO FINAL:');
  if (!serverOk) {
    console.log('❌ O servidor MySQL não está acessível. Verifique se o serviço está em execução.');
  } else if (!dbOk) {
    console.log(`❌ O banco de dados '${dbConfig.database}' não existe. Execute o script SQL para criá-lo.`);
  } else if (!tablesOk) {
    console.log('❌ Faltam tabelas necessárias no banco de dados. Execute o script SQL completo.');
  } else if (!recordsOk) {
    console.log('⚠️ Algumas tabelas não têm registros ou o usuário de teste não foi encontrado.');
  } else {
    console.log('✅ Tudo parece estar configurado corretamente!');
  }
  
  console.log('\n🛠️ PRÓXIMOS PASSOS:');
  if (!serverOk) {
    console.log('1. Inicie o servidor MySQL');
    console.log('2. Verifique as credenciais no arquivo .env ou config/database.js');
  } else if (!dbOk) {
    console.log(`1. Execute o script SQL para criar o banco: mysql -u ${dbConfig.user} -p < "db/LEVEL_ALL_POPULADA.sql"`);
  } else if (!tablesOk || !recordsOk) {
    console.log('1. Execute o script SQL completo para criar todas as tabelas e inserir dados');
  } else {
    console.log('1. Inicie o servidor backend: node index.js');
    console.log('2. Acesse o frontend e tente fazer login');
  }
};

// Executar o diagnóstico
runTests();
