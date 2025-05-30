import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import multer from 'multer';

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

// teste de conexão com o banco de dados
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connection successful', result: rows[0].result });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
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
        SELECT *, 'gamer' as user_type FROM users_gamer
        UNION ALL
        SELECT *, 'developer' as user_type FROM users_developer
        UNION ALL
        SELECT *, 'investor' as user_type FROM users_investor
        UNION ALL
        SELECT *, 'admin' as user_type FROM users_admin
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
    const { usrname, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (username, nome, email, senha) VALUES (?, ?, ?, ?)',
      [usrname, nome, email, senha]
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
    const { usrname, nome, email, senha } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (username, nome, email, senha) VALUES (?, ?, ?, ?)',
      [usrname, nome, email, senha]
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
    const { usrname, nome, email, senha, cnpj } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (username, nome, email, senha, cnpj) VALUES (?, ?, ?, ?, ?)',
      [usrname, nome, email, senha, cnpj]
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
      'INSERT INTO users (username, nome, email, senha) VALUES (?, ?, ?, ?)',
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
      'UPDATE users SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
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
      'UPDATE users SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
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
      'UPDATE users SET username = ?, nome = ?, email = ?, senha = ?, cnpj = ? WHERE id = ?',
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
      'UPDATE users SET username = ?, nome = ?, email = ?, senha = ? WHERE id = ?',
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
    const [gamerResult] = await pool.query('DELETE FROM users_gamer WHERE username = ?', [req.params.username]);
    const [developerResult] = await pool.query('DELETE FROM users_developer WHERE username = ?', [req.params.username]);
    const [investorResult] = await pool.query('DELETE FROM users_investor WHERE username = ?', [req.params.username]);
    const [adminResult] = await pool.query('DELETE FROM users_admin WHERE username = ?', [req.params.username]);

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
  try {
    const [rows] = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    res.status(500).json({ error: 'Erro ao buscar publicações' });
  }
});

// inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

