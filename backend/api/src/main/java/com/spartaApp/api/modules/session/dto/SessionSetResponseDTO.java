package com.spartaApp.api.modules.session.dto;

import com.spartaApp.api.modules.session.domain.TrainingSessionSet;
import java.time.LocalDateTime;
import java.util.UUID;

public record SessionSetResponseDTO(
        UUID id,
        UUID plannedSetId,
        String exerciseName,
        Integer repsCompleted,
        Double weightUsed,
        Boolean failure,
        LocalDateTime completedAt
) {
    public static SessionSetResponseDTO fromEntity(TrainingSessionSet set) {
        return new SessionSetResponseDTO(
                set.getId(),
                set.getPlannedSet().getId(),
                set.getPlannedSet().getExerciseName(),
                set.getRepsCompleted(),
                set.getWeightUsed(),
                set.getFailure(),
                set.getCompletedAt()
        );
    }
}