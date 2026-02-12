package com.spartaApp.api.modules.exercise.dto;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import java.util.UUID;

/**
 * DTO otimizado para IA (n8n + Gemini)
 * Apenas campos essenciais para reduzir tokens
 */
public record ExerciseCatalogDTO(
        UUID id,
        String name,
        String muscleGroup,      // CHEST, BACK, LEGS...
        String mechanics,        // COMPOSTO, ISOLADO
        String equipment,        // Peso Livre, Máquina...
        String targetMuscle      // Opcional: ajuda IA escolher melhor
) {
    public static ExerciseCatalogDTO fromEntity(Exercise exercise) {
        return new ExerciseCatalogDTO(
                exercise.getId(),
                exercise.getName(),
                exercise.getMuscleGroup().name(),
                exercise.getMechanics(),
                exercise.getEquipment(),
                exercise.getTargetMuscle()
        );
    }
}
