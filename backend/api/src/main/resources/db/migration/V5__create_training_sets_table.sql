-- =====================================================
-- MIGRATION V5: Tabela de Séries Detalhadas do Treino
-- =====================================================
-- Esta tabela armazena CADA SÉRIE de CADA EXERCÍCIO de CADA TREINO
-- permitindo edição granular e registro de execução

CREATE TABLE tb_training_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamento com o Treino
    training_id UUID NOT NULL,
    
    -- Identificação do Exercício
    exercise_id UUID NOT NULL,
    exercise_name VARCHAR(255) NOT NULL, -- Denormalizado para facilitar queries
    
    -- Estrutura do Treino (Ordem de Execução)
    day_letter VARCHAR(10) NOT NULL,     -- "A", "B", "C", "D"
    exercise_order INT NOT NULL,          -- Ordem dentro do dia (1, 2, 3...)
    
    -- Prescrição (O que o Personal definiu)
    sets INT NOT NULL,                    -- Número de séries (ex: 3)
    reps VARCHAR(50) NOT NULL,            -- Repetições (ex: "8-12" ou "10")
    rest_seconds INT,                     -- Descanso entre séries (ex: 90)
    load_prescription VARCHAR(100),       -- Ex: "70% 1RM" ou "Falha"
    
    -- Técnica/Observações
    technique VARCHAR(50),                -- Ex: "Drop Set", "Rest-Pause"
    notes TEXT,                           -- Observações do Personal
    
    -- Controle de Execução (Preenchido pelo Aluno)
    sets_completed INT DEFAULT 0,         -- Quantas séries ele fez
    actual_load VARCHAR(50),              -- Carga real usada (ex: "20kg")
    completed_at TIMESTAMP,               -- Quando ele terminou este exercício
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (training_id) REFERENCES tb_trainings(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES tb_exercises(id)
);

-- Índices para Performance
CREATE INDEX idx_training_sets_training ON tb_training_sets(training_id);
CREATE INDEX idx_training_sets_day ON tb_training_sets(training_id, day_letter);
CREATE INDEX idx_training_sets_order ON tb_training_sets(training_id, day_letter, exercise_order);

-- =====================================================
-- COMENTÁRIOS IMPORTANTES:
-- =====================================================
-- 1. O campo `content` da tb_trainings agora serve apenas como "backup" do JSON original da IA
-- 2. A estrutura real e editável fica em tb_training_sets
-- 3. Quando a IA gerar o treino, o backend deve:
--    a) Salvar o JSON no campo `content`
--    b) Parsear o JSON e popular tb_training_sets
-- 4. Quando o Personal editar, só modifica tb_training_sets
-- 5. Quando o Aluno executar, marca em tb_training_sets
