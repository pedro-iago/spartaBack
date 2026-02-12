package com.spartaApp.api.modules.training.dto;

import com.spartaApp.api.modules.training.domain.TrainingSet;

import java.time.LocalDateTime;
import java.util.UUID;

public record TrainingSetDTO(
        UUID id,
        UUID exerciseId,
        String exerciseName,
        String dayLetter,
        Integer exerciseOrder,
        Integer sets,
        String reps,
        Integer restSeconds,
        String loadPrescription,
        String technique,
        String notes,
        Integer setsCompleted,
        String actualLoad,
        LocalDateTime completedAt
) {
    public static TrainingSetDTO fromEntity(TrainingSet set) {
        return new TrainingSetDTO(
                set.getId(),
                set.getExerciseId(),
                set.getExerciseName(),
                set.getDayLetter(),
                set.getExerciseOrder(),
                set.getSets(),
                set.getReps(),
                set.getRestSeconds(),
                set.getLoadPrescription(),
                set.getTechnique(),
                set.getNotes(),
                set.getSetsCompleted(),
                set.getActualLoad(),
                set.getCompletedAt()
        );
    }
}
