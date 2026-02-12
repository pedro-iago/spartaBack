CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tb_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    -- Aqui já definimos corretamente o Enum que está no Java
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',

    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);