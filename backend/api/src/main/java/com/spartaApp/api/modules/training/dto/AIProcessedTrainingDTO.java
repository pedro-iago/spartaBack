package com.spartaApp.api.modules.training.dto;

import java.util.List;
import java.util.UUID;

/**
 * DTO para receber a resposta final do n8n
 * Já vem com exercise_id (UUIDs válidos do catálogo)
 */
public record AIProcessedTrainingDTO(
        UUID trainingId,         // ID do treino criado no backend
        String planName,         // Nome do plano gerado
        String description,      // Descrição da estratégia
        List<WorkoutDay> workouts
) {
    public record WorkoutDay(
            String dayLetter,    // "A", "B", "C", "D"
            String name,         // "Treino A - Upper"
            String muscleGroups, // "Peito, Costas, Ombros"
            List<ExerciseSet> exercises
    ) {}

    public record ExerciseSet(
            UUID exerciseId,     // ⭐ UUID do exercício (validado)
            Integer order,       // Ordem de execução (1, 2, 3...)
            Integer sets,        // Número de séries
            String reps,         // "8-12" ou "10"
            Integer restSeconds, // 90, 120, 45
            String loadPrescription,  // "70% 1RM", "Falha", etc
            String technique,    // "Drop Set", "Rest-Pause"
            String notes         // Observações do Personal
    ) {}
}
