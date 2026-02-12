CREATE TABLE tb_trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,

    -- Protocolo
    level VARCHAR(50) NOT NULL,
    focus VARCHAR(50) NOT NULL,
    days_per_week INT NOT NULL,
    limitations TEXT,

    -- O CORE: O Treino gerado
    -- Usar JSONB permite que o banco entenda a estrutura interna se precisarmos filtrar
    content JSONB,

    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PENDING_REVIEW, ACTIVE, ARCHIVED

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES tb_users(id)
);