package com.spartaApp.api.modules.training.dto;

import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record TrainingResponseDTO(
        UUID id,
        UUID userId,
        String userName,
        String level,
        String focus,
        Integer daysPerWeek,
        String limitations,
        TrainingStatus status,
        List<TrainingSetDTO> sets,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TrainingResponseDTO fromEntity(Training training) {
        List<TrainingSetDTO> setDTOs = training.getSets().stream()
                .map(TrainingSetDTO::fromEntity)
                .collect(Collectors.toList());

        return new TrainingResponseDTO(
                training.getId(),
                training.getUser().getId(),
                training.getUser().getName(),
                training.getLevel(),
                training.getFocus(),
                training.getDaysPerWeek(),
                training.getLimitations(),
                training.getStatus(),
                setDTOs,
                training.getCreatedAt(),
                training.getUpdatedAt()
        );
    }
}
