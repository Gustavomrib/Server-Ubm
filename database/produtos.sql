-- Rodar 1x no SQL Editor do Neon
CREATE TABLE IF NOT EXISTS produtos (
    codpro serial PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descri TEXT,
    fabricante VARCHAR(255),
    qtda INTEGER,
    preco NUMERIC(10, 2),
    custo NUMERIC(10, 2),
    data timestamp DEFAULT CURRENT_TIMESTAMP
);
