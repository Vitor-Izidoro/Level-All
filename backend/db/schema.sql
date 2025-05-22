-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS level_all;
USE level_all;

-- Tabela de usuários gamer
CREATE TABLE IF NOT EXISTS users_gamer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    nivel INT DEFAULT 1,
    pontos INT DEFAULT 0,
    avatar_url VARCHAR(255),
    bio TEXT,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabela de usuários developer
CREATE TABLE IF NOT EXISTS users_developer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    empresa VARCHAR(100),
    cargo VARCHAR(100),
    portfolio_url VARCHAR(255),
    bio TEXT,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabela de usuários investor
CREATE TABLE IF NOT EXISTS users_investor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    cnpj VARCHAR(14) UNIQUE,
    empresa VARCHAR(100),
    portfolio_url VARCHAR(255),
    bio TEXT,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_cnpj (cnpj)
);

-- Tabela de usuários admin
CREATE TABLE IF NOT EXISTS users_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    nivel_acesso ENUM('admin', 'super_admin') DEFAULT 'admin',
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabela de jogos
CREATE TABLE IF NOT EXISTS games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    developer_id INT,
    data_lancamento DATE,
    preco DECIMAL(10,2),
    categoria VARCHAR(50),
    status ENUM('em_desenvolvimento', 'lancado', 'pausado') DEFAULT 'em_desenvolvimento',
    imagem_url VARCHAR(255),
    FOREIGN KEY (developer_id) REFERENCES users_developer(id) ON DELETE SET NULL,
    INDEX idx_titulo (titulo),
    INDEX idx_categoria (categoria)
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT,
    gamer_id INT,
    nota INT CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (gamer_id) REFERENCES users_gamer(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (game_id, gamer_id)
);

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT,
    investor_id INT,
    valor DECIMAL(10,2) NOT NULL,
    data_investimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (investor_id) REFERENCES users_investor(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    user_type ENUM('gamer', 'developer', 'investor', 'admin'),
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50),
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, user_type),
    INDEX idx_lida (lida)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    remetente_id INT,
    remetente_tipo ENUM('gamer', 'developer', 'investor', 'admin'),
    destinatario_id INT,
    destinatario_tipo ENUM('gamer', 'developer', 'investor', 'admin'),
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_remetente (remetente_id, remetente_tipo),
    INDEX idx_destinatario (destinatario_id, destinatario_tipo)
); 