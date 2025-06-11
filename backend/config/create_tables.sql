-- Tabela de comunidades
CREATE TABLE IF NOT EXISTS comunidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criador_id INT NOT NULL,
    banner VARCHAR(255),
    tags VARCHAR(255),
    monetizado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (criador_id) REFERENCES user_gamer(id)
);

-- Tabela de membros das comunidades
CREATE TABLE IF NOT EXISTS membros_comunidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comunidade_id INT NOT NULL,
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comunidade_id) REFERENCES comunidades(id),
    FOREIGN KEY (usuario_id) REFERENCES user_gamer(id),
    UNIQUE KEY unique_membro (comunidade_id, usuario_id)
);

-- Tabela de posts das comunidades
CREATE TABLE IF NOT EXISTS posts_comunidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comunidade_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    hashtags VARCHAR(255),
    imagem VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (comunidade_id) REFERENCES comunidades(id),
    FOREIGN KEY (usuario_id) REFERENCES user_gamer(id)
); 