INSERT INTO tb_exercises (name, muscle_group, target_muscle, secondary_muscles, mechanics, equipment, video_url, description) VALUES

-- PEITO (CHEST)
('Supino Reto com Barra', 'CHEST', 'Peitoral Maior', 'Tríceps, Deltoide Anterior', 'COMPOSTO', 'Peso Livre', 'https://youtube.com/shorts/exemplo1', 'Mantenha as escápulas retraídas.'),
('Supino Inclinado Halteres', 'CHEST', 'Peitoral Superior', 'Tríceps, Deltoide Anterior', 'COMPOSTO', 'Peso Livre', NULL, 'Banco a 30 ou 45 graus.'),
('Crucifixo Máquina (Peck Deck)', 'CHEST', 'Peitoral Maior', NULL, 'ISOLADO', 'Máquina', NULL, NULL),

-- COSTAS (BACK)
('Puxada Alta (Lat Pulldown)', 'BACK', 'Grande Dorsal', 'Bíceps, Redondo Maior', 'COMPOSTO', 'Polia', NULL, 'Puxe em direção ao peito superior.'),
('Remada Curvada', 'BACK', 'Grande Dorsal', 'Bíceps, Lombar', 'COMPOSTO', 'Peso Livre', NULL, 'Coluna neutra.'),

-- PERNAS (LEGS)
('Agachamento Livre', 'LEGS', 'Quadríceps', 'Glúteo Máximo, Lombar', 'COMPOSTO', 'Peso Livre', NULL, 'Quebre a paralela.'),
('Leg Press 45', 'LEGS', 'Quadríceps', 'Glúteo Máximo', 'COMPOSTO', 'Máquina', NULL, 'Não tire o quadril do banco.'),
('Stiff com Barra', 'LEGS', 'Isquiotibiais', 'Glúteo Máximo', 'COMPOSTO', 'Peso Livre', NULL, 'Posterior de coxa.'),
('Mesa Flexora', 'LEGS', 'Isquiotibiais', NULL, 'ISOLADO', 'Máquina', NULL, NULL),

-- OMBROS (SHOULDERS)
('Desenvolvimento Militar', 'SHOULDERS', 'Deltoide Anterior', 'Tríceps', 'COMPOSTO', 'Peso Livre', NULL, 'Barra passa rente ao rosto.'),
('Elevação Lateral', 'SHOULDERS', 'Deltoide Lateral', NULL, 'ISOLADO', 'Halteres', NULL, 'Cotovelos levemente flexionados.'),

-- BRAÇOS (BICEPS/TRICEPS)
('Tríceps Corda', 'TRICEPS', 'Tríceps', NULL, 'ISOLADO', 'Polia', NULL, 'Estenda tudo embaixo.'),
('Rosca Direta', 'BICEPS', 'Bíceps', 'Antebraço', 'ISOLADO', 'Barra', NULL, 'Sem roubar com a coluna.');