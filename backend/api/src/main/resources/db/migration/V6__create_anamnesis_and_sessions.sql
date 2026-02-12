-- =====================================================
-- MIGRATION V6: Estrutura de Anamnese e Sessões de Treino (Execução)
-- =====================================================

-- 1. Criar tabela de Anamnese
CREATE TABLE tb_anamnesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,

    -- Dados Físicos
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    age INTEGER,
    gender VARCHAR(50),

    -- Perfil
    goal VARCHAR(255) NOT NULL,
    activity_level VARCHAR(255) NOT NULL,
    days_per_week_available INTEGER,

    -- Saúde
    injuries TEXT,
    medical_conditions TEXT,

    -- Controle
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_anamnesis_user FOREIGN KEY (user_id) REFERENCES tb_users(id)
);

-- 2. Criar tabela de Sessões de Treino (Histórico de quando o aluno foi treinar)
CREATE TABLE tb_training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    training_id UUID NOT NULL,

    -- Controle do Dia
    day_letter VARCHAR(5) NOT NULL, -- "A", "B"...

    -- Tempo
    started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITHOUT TIME ZONE,

    -- Status e Métricas
    status VARCHAR(50) NOT NULL, -- IN_PROGRESS, FINISHED
    total_volume_load DOUBLE PRECISION DEFAULT 0.0,

    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES tb_users(id),
    CONSTRAINT fk_session_training FOREIGN KEY (training_id) REFERENCES tb_trainings(id)
);

-- 3. Criar tabela de Sets Executados (O que foi feito de fato na sessão)
CREATE TABLE tb_training_session_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    planned_set_id UUID NOT NULL, -- Link com o que foi prescrito

    -- Dados Reais
    reps_completed INTEGER,
    weight_used DOUBLE PRECISION,
    rpe INTEGER,

    -- Flags
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    failure BOOLEAN NOT NULL DEFAULT FALSE,

    completed_at TIMESTAMP WITHOUT TIME ZONE,

    CONSTRAINT fk_session_sets_session FOREIGN KEY (session_id) REFERENCES tb_training_sessions(id),
    CONSTRAINT fk_session_sets_planned FOREIGN KEY (planned_set_id) REFERENCES tb_training_sets(id)
);

-- 4. Limpar a tabela de prescrição (tb_training_sets)
-- Removemos os campos de execução pois agora eles vivem em tb_training_session_sets
ALTER TABLE tb_training_sets
DROP COLUMN IF EXISTS sets_completed,
DROP COLUMN IF EXISTS actual_load,
DROP COLUMN IF EXISTS completed_at;