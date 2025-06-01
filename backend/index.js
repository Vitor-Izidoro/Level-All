import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));

// configuração do CORS
const corsOptions = {
  origin: ['http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// rota de login
app.post('/login', async (req, res) => {
  const { username, password, userType } = req.body;
  
  console.log(`Tentativa de login: ${username}, tipo: ${userType}`); // Adicionar log para debug
  
  try {
    let tableName;
    
    switch(userType) {
      case 'gamer':
        tableName = 'user_gamer';
        break;
      case 'developer':
        tableName = 'user_developer';
        break;
      case 'investor':
        tableName = 'user_investor';
        break;
      case 'admin':
        tableName = 'user_admin';
        break;
      default:
        console.log(`Tipo de usuário inválido: ${userType}`);
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }
      // Verificar se a tabela existe
    const [tables] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
        AND table_name = ?
    `, ['level_all', tableName]);
    
    if (tables.length === 0) {
      console.log(`Tabela não encontrada: ${tableName}`);
      return res.status(500).json({ error: `Tabela ${tableName} não encontrada` });
    }
    
    // Consulta ao banco de dados para verificar as credenciais
    console.log(`Verificando usuário na tabela ${tableName}`);
    const [users] = await pool.query(
      `SELECT * FROM ${tableName} WHERE username = ?`,
      [username]
    );
    
    if (users.length === 0) {
      console.log(`Usuário não encontrado: ${username}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const user = users[0];
    console.log(`Usuário encontrado: ${user.nome}`);
      // Para depuração - verificar os campos existentes no usuário
    console.log('Campos disponíveis no usuário:', Object.keys(user));
    
    // Verificar se o campo senha existe
    if (!user.hasOwnProperty('senha')) {
      console.log('Erro: Campo senha não encontrado no objeto usuário');
      return res.status(500).json({ error: 'Erro no sistema de autenticação' });
    }
    
    // Verificação simples de senha - em produção deveria usar bcrypt
    if (user.senha !== password) {
      console.log('Senha incorreta');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    console.log('Credenciais válidas, gerando token');
    // Gera um token JWT com as informações do usuário
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        nome: user.nome,
        userType: userType
      },
      process.env.JWT_SECRET || 'seu_jwt_secret',
      { expiresIn: '1h' }
    );
    
    // Retorna os dados do usuário e o token
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        nome: user.nome,
        email: user.email,
        userType
      },
      token
    });
      } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    // Verificar se é um erro de conexão com o banco de dados
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados. Verifique se o MySQL está em execução.',
        details: error.message,
        code: error.code
      });
    }
    
    // Se for um erro específico do MySQL
    if (error.sqlMessage) {
      return res.status(500).json({ 
        error: 'Erro no banco de dados',
        details: error.sqlMessage,
        code: error.code
      });
    }
    
    // Para outros tipos de erro
    return res.status(500).json({ 
      error: 'Erro ao processar o login',
      details: error.message
    });
  }
});

// middleware para verificar autenticação
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// rota protegida de exemplo
app.get('/perfil', verificarToken, (req, res) => {
  res.json({ usuario: req.usuario });
});

// teste de conexão com o banco de dados
// Rota simples para verificar se o servidor está online
app.get('/health', (req, res) => {
  console.log('Verificação de saúde do servidor solicitada');
  return res.json({ status: 'ok', server: 'online' });
});

// rota de registro de novos usuários
app.post('/register', async (req, res) => {
  const { username, nome, email, senha, userType, cnpj } = req.body;
  
  console.log(`Tentativa de registro: ${username}, tipo: ${userType}`);
  
  try {
    // Não permitir registro de administradores
    if (userType === 'admin') {
      return res.status(403).json({ error: 'Não é permitido o registro de administradores' });
    }
    
    // Validar campos obrigatórios
    if (!username || !nome || !email || !senha || !userType) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido' });
    }
    
    // Validar investidor precisa ter CNPJ
    if (userType === 'investor' && !cnpj) {
      return res.status(400).json({ error: 'CNPJ é obrigatório para investidores' });
    }
    
    let tableName;
    
    switch(userType) {
      case 'gamer':
        tableName = 'user_gamer';
        break;
      case 'developer':
        tableName = 'user_developer';
        break;
      case 'investor':
        tableName = 'user_investor';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }
    
    // Verificar se username já existe
    const [usernameCheck] = await pool.query(
      `SELECT username FROM ${tableName} WHERE username = ?`,
      [username]
    );
    
    if (usernameCheck.length > 0) {
      return res.status(400).json({ error: 'Nome de usuário já está em uso' });
    }
    
    // Verificar se email já existe
    const [emailCheck] = await pool.query(
      `SELECT email FROM ${tableName} WHERE email = ?`,
      [email]
    );
    
    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
    }
    
    // Para investidores, verificar CNPJ também
    if (userType === 'investor') {
      const [cnpjCheck] = await pool.query(
        `SELECT cnpj FROM ${tableName} WHERE cnpj = ?`,
        [cnpj]
      );
      
      if (cnpjCheck.length > 0) {
        return res.status(400).json({ error: 'CNPJ já cadastrado' });
      }
    }
    
    // Inserir usuário no banco de dados
    let insertQuery, insertParams;
    
    if (userType === 'investor') {
      insertQuery = `INSERT INTO ${tableName} (username, nome, email, senha, cnpj) VALUES (?, ?, ?, ?, ?)`;
      insertParams = [username, nome, email, senha, cnpj];
    } else {
      insertQuery = `INSERT INTO ${tableName} (username, nome, email, senha) VALUES (?, ?, ?, ?)`;
      insertParams = [username, nome, email, senha];
    }
    
    const [result] = await pool.query(insertQuery, insertParams);
    
    if (result.affectedRows === 1) {
      // Gerar token JWT para o novo usuário
      const token = jwt.sign(
        { 
          id: result.insertId, 
          username,
          nome,
          userType
        },
        process.env.JWT_SECRET || 'seu_jwt_secret',
        { expiresIn: '1h' }
      );
      
      // Retornar dados do novo usuário e token
      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: {
          id: result.insertId,
          username,
          nome,
          email,
          userType
        },
        token
      });
    } else {
      throw new Error('Erro ao inserir usuário no banco de dados');
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Nome de usuário ou e-mail já está em uso' });
    }
    
    return res.status(500).json({ 
      error: 'Erro ao processar o registro',
      details: error.message
    });
  }
});

app.get('/test-db', async (req, res) => {
  try {
    console.log('Testando conexão com o banco de dados...');
    const connection = await pool.getConnection();
    console.log('Conexão obtida, executando query de teste...');
    
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    connection.release();
    
    console.log('Teste de conexão bem-sucedido!');
    return res.json({ 
      message: 'Database connection successful', 
      result: rows[0].result,
      database: {
        name: process.env.DB_NAME || 'level_all',
        host: process.env.DB_HOST || 'localhost'
      }
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    // Retornar mensagem mais informativa para ajudar no diagnóstico
    return res.status(500).json({
      error: 'Database connection failed',
      details: error.message,
      errorCode: error.code
    });
  }
});

// GET - Todos os contatos
app.get('/contacts', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM contacts`);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
});

// GET - Contato específico por ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM contacts WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({ error: 'Erro ao buscar contato' });
  }
});

// POST - Criar novo contato
app.post('/contacts', async (req, res) => {
  const { user_id, contact_user_id } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO contacts (user_id, contact_user_id) VALUES (?, ?)`,
      [user_id, contact_user_id]
    );
    const [newContact] = await pool.query(`SELECT * FROM contacts WHERE id = ?`, [result.insertId]);
    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    res.status(500).json({ error: 'Erro ao criar contato' });
  }
});

// PUT - Atualizar contato existente
app.put('/contacts/:id', async (req, res) => {
  const { user_id, contact_user_id } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE contacts SET user_id = ?, contact_user_id = ? WHERE id = ?`,
      [user_id, contact_user_id, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    const [updatedContact] = await pool.query(`SELECT * FROM contacts WHERE id = ?`, [req.params.id]);
    res.json(updatedContact[0]);
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contato' });
  }
});

// DELETE - Remover contato
app.delete('/contacts/:id', async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM contacts WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    res.json({ message: 'Contato excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir contato:', error);
    res.status(500).json({ error: 'Erro ao excluir contato' });
  }
});

// GET - Todas as mensagens
app.get('/messages', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM messages`);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// GET - Mensagem específica por ID
app.get('/messages/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM messages WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagem' });
  }
});

// POST - Criar nova mensagem
app.post('/messages', async (req, res) => {
  const { contact_id, remetente_id, destinatario_id, conteudo } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO messages (contact_id, remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?, ?)`,
      [contact_id, remetente_id, destinatario_id, conteudo]
    );
    const [newMessage] = await pool.query(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ error: 'Erro ao criar mensagem' });
  }
});

// PUT - Atualizar mensagem existente
app.put('/messages/:id', async (req, res) => {
  const { contact_id, remetente_id, destinatario_id, conteudo } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE messages SET contact_id = ?, remetente_id = ?, destinatario_id = ?, conteudo = ? WHERE id = ?`,
      [contact_id, remetente_id, destinatario_id, conteudo, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    const [updatedMessage] = await pool.query(`SELECT * FROM messages WHERE id = ?`, [req.params.id]);
    res.json(updatedMessage[0]);
  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error);
    res.status(500).json({ error: 'Erro ao atualizar mensagem' });
  }
});

// DELETE - Remover mensagem
app.delete('/messages/:id', async (req, res) => {
  try {
    const [result] = await pool.query(`DELETE FROM messages WHERE id = ?`, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    res.json({ message: 'Mensagem excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir mensagem:', error);
    res.status(500).json({ error: 'Erro ao excluir mensagem' });
  }
});

// pega todos os usuários
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nome,
        email,
        genero,
        telefone,
        endereco,
        filmeFav
      FROM users
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users from database' });
  }
});

// pega um usuário específico pelo username em qualquer tabela
app.get('/user/:username', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM (
        SELECT *, 'gamer' as user_type FROM user_gamer
        UNION ALL
        SELECT *, 'developer' as user_type FROM user_developer
        UNION ALL
        SELECT *, 'investor' as user_type FROM user_investor
        UNION ALL
        SELECT *, 'admin' as user_type FROM user_admin
      ) all_users
      WHERE username = ?
    `, [req.params.username]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found in any table' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user from database' });
  }
});

// cria um novo usuário gamer
app.post('/user_gamer', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_gamer (username, nome, email, senha) VALUES (?, ?, ?, ?)',
      [username, nome, email, senha]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user in database' });
  }
});

// cria um novo usuário developer
app.post('/user_developer', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_developer (username, nome, email, senha) VALUES (?, ?, ?, ?)',
      [username, nome, email, senha]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user in database' });
  }
});

// cria um novo usuário investor
app.post('/user_investor', async (req, res) => {
  try {
    const { username, nome, email, senha, cnpj } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_investor (username, nome, email, senha, cnpj) VALUES (?, ?, ?, ?, ?)',
      [username, nome, email, senha, cnpj]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user in database' });
  }
});

// cria um novo usuário admin
app.post('/user_admin', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_admin (username, nome, email, senha) VALUES (?, ?, ?, ?)',
      [username, nome, email, senha]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Error creating user:', error); 
    res.status(500).json({ error: 'Error creating user in database' });
  }
});


// atualiza um usuário gamer
app.put('/user_gamer/:id', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'UPDATE user_gamer SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
      [username, nome, email, senha, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user in database' });
  }
});

// atualiza um usuário developer
app.put('/user_developer/:id', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'UPDATE user_developer SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
      [username, nome, email, senha, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user in database' });
  }
});

// atualiza um usuário investor
app.put('/user_investor/:id', async (req, res) => {
  try {
    const { username, nome, email, senha, cnpj } = req.body;
    const [result] = await pool.query(
      'UPDATE user_investor SET username = ?, nome = ?, email = ?, senha = ?, cnpj = ? WHERE id = ?',
      [username, nome, email, senha, cnpj, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user in database' });
  }
});

// atualiza um usuário admin
app.put('/user_admin/:id', async (req, res) => {
  try {
    const { username, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'UPDATE user_admin SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
      [username, nome, email, senha, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user in database' });
  }
});


// deleta um usuário de qualquer tabela pelo username
app.delete('/user/:username', async (req, res) => {
  try {
    // Tenta deletar de todas as tabelas
    const [gamerResult] = await pool.query('DELETE FROM user_gamer WHERE username = ?', [req.params.username]);
    const [developerResult] = await pool.query('DELETE FROM user_developer WHERE username = ?', [req.params.username]);
    const [investorResult] = await pool.query('DELETE FROM user_investor WHERE username = ?', [req.params.username]);
    const [adminResult] = await pool.query('DELETE FROM user_admin WHERE username = ?', [req.params.username]);

    // Verifica se algum registro foi deletado
    const totalDeleted = gamerResult.affectedRows + developerResult.affectedRows + 
                        investorResult.affectedRows + adminResult.affectedRows;

    if (totalDeleted === 0) {
      return res.status(404).json({ error: 'User not found in any table' });
    }

    res.json({ 
      message: 'User deleted successfully',
      deletedFrom: {
        gamer: gamerResult.affectedRows > 0,
        developer: developerResult.affectedRows > 0,
        investor: investorResult.affectedRows > 0,
        admin: adminResult.affectedRows > 0
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user from database' });
  }
});

// Cria uma nova publicação
app.post('/posts', upload.single('imagem'), async (req, res) => {
  try {
    const { user_id, texto } = req.body;
    const imagem = req.file ? req.file.filename : null;
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, texto, imagem) VALUES (?, ?, ?)',
      [user_id, texto, imagem]
    );
    res.status(201).json({ id: result.insertId, user_id, texto, imagem });
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    res.status(500).json({ error: 'Erro ao criar publicação' });
  }
});

// Busca todas as publicações
app.get('/posts', async (req, res) => {
  try {    // Primeiro, verifica se a tabela posts existe
    const [tables] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'level_all' 
        AND table_name = 'posts'
    `);
    
    if (tables.length === 0) {
      // Se a tabela não existir, retorna um array vazio
      console.log('A tabela posts não existe no banco de dados');
      return res.json([]);
    }
    
    // Se a tabela existir, busca os posts
    const [rows] = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    // Para evitar o erro 500, retornamos um array vazio em caso de erro
    res.json([]);
  }
});

// Função para testar a conexão com o banco de dados
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

// inicia o servidor com verificação de banco de dados
const PORT = process.env.PORT || 3000;

// Tentar iniciar o servidor
const startServer = async () => {
  try {
    console.log('Verificando conexão com o banco de dados...');
    const databaseConnected = await testDatabaseConnection();
    
    if (databaseConnected) {
      console.log('✅ Conexão com o banco de dados estabelecida!');
      
      // Iniciar o servidor HTTP
      app.listen(PORT, () => {
        console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
        console.log('Para testar o login, use:');
        console.log(' - Username: shadowwolf01');
        console.log(' - Senha: senha123');
        console.log(' - Tipo: gamer');
      });
    } else {
      console.error('❌ Falha ao conectar ao banco de dados. O servidor foi iniciado, mas pode haver problemas nas operações do banco.');
      console.error('Por favor, verifique:');
      console.error(' - Se o servidor MySQL está rodando');
      console.error(' - Se as credenciais estão corretas');
      console.error(' - Se o banco de dados "level_all" existe');
      
      // Iniciar o servidor mesmo assim, para permitir endpoints que não dependem do banco
      app.listen(PORT, () => {
        console.log(`⚠️ Servidor rodando com problemas em http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1); // Encerrar o processo com código de erro
  }
};

// Iniciar o servidor
startServer();

