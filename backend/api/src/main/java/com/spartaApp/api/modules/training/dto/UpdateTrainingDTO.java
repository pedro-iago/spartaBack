package com.spartaApp.api.modules.training.dto;

import java.util.List;
import java.util.UUID;

public record UpdateTrainingDTO(
        List<SetUpdate> sets
) {
    public record SetUpdate(
            UUID id,              // ID da série (null se for nova)
            UUID exerciseId,      // ID do exercício
            String dayLetter,     // "A", "B", "C"
            Integer exerciseOrder,
            Integer sets,
            String reps,
            Integer restSeconds,
            String loadPrescription,
            String technique,
            String notes
    ) {}
}
