package com.spartaApp.api.modules.exercise.dto;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import java.util.UUID;

public record ExerciseResponseDTO(
        UUID id,
        String name,
        String targetMuscle,
        String secondaryMuscles,
        String mechanics,
        String equipment,
        String description,
        String videoUrl,
        Boolean isCustom,
        Boolean isMine // Um "agrado" para o front saber se foi o usuário que criou
) {
    public static ExerciseResponseDTO fromEntity(Exercise exercise, UUID currentUserId) {
        boolean isMine = exercise.getCreatedByUserId() != null &&
                exercise.getCreatedByUserId().equals(currentUserId);

        return new ExerciseResponseDTO(
                exercise.getId(),
                exercise.getName(),
                exercise.getTargetMuscle(),
                exercise.getSecondaryMuscles(),
                exercise.getMechanics(),
                exercise.getEquipment(),
                exercise.getDescription(),
                exercise.getVideoUrl(),
                exercise.getIsCustom(),
                isMine
        );
    }
}