CREATE TABLE tb_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Identificação e Mídia
    name VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),

    -- Classificação Técnica
    muscle_group VARCHAR(50) NOT NULL,       -- Enum Java: CHEST, BACK, LEGS...
    target_muscle VARCHAR(50) NOT NULL,      -- Ex: Peitoral Maior
    secondary_muscles VARCHAR(255),
    mechanics VARCHAR(50) NOT NULL,          -- COMPOSTO / ISOLADO
    equipment VARCHAR(50) NOT NULL,          -- Maquina, Halteres...
    difficulty_level VARCHAR(20) DEFAULT 'BEGINNER',

    -- Controle
    is_custom BOOLEAN DEFAULT FALSE,
    created_by_user_id UUID,

    active BOOLEAN DEFAULT TRUE, -- <--- ESTA LINHA ESTAVA FALTANDO

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_exercise_creator FOREIGN KEY (created_by_user_id) REFERENCES tb_users(id)
);

CREATE INDEX idx_exercises_group ON tb_exercises(muscle_group);