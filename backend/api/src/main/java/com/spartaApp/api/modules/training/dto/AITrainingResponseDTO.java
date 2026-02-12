package com.spartaApp.api.modules.training.dto;

import java.util.List;

/**
 * DTO para receber a resposta da IA no formato atual
 * onde os exercícios vêm com nomes (strings) ao invés de IDs
 */
public record AITrainingResponseDTO(
        String nome_treino,
        String descricao,
        List<WorkoutDay> treinos
) {
    public record WorkoutDay(
            String nome,         // "Treino A - Upper"
            String musculos,     // "Peito, Costas, Ombros"
            List<ExerciseInfo> exercicios
    ) {}

    public record ExerciseInfo(
            String nome,         // "Supino Reto com Halteres"
            Integer series,      // 4
            String reps,         // "8-12"
            String descanso,     // "120s" ou "90s"
            String tecnica,      // "Controle a descida..."
            String load_prescription  // Opcional: "70% 1RM"
    ) {
        /**
         * Converte descanso de "120s" para Integer 120
         */
        public Integer getRestSeconds() {
            if (descanso == null) return 90; // Default
            return Integer.parseInt(descanso.replaceAll("[^0-9]", ""));
        }

        /**
         * Extrai letra do dia do nome do treino
         * Ex: "Treino A - Upper" → "A"
         */
        public static String extractDayLetter(String workoutName) {
            if (workoutName == null) return "A";
            
            // Tenta pegar letra após "Treino "
            if (workoutName.contains("Treino ")) {
                String after = workoutName.substring(workoutName.indexOf("Treino ") + 7);
                if (!after.isEmpty() && Character.isLetter(after.charAt(0))) {
                    return String.valueOf(after.charAt(0)).toUpperCase();
                }
            }
            
            // Fallback: A, B, C, D baseado na posição
            return "A"; // Será substituído no service
        }
    }
}
