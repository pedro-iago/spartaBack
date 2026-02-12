package com.spartaApp.api.modules.admin.dto;

import com.spartaApp.api.modules.training.domain.Training;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminTrainingDTO(
        UUID id,
        String studentName,
        String personalName, // Pode ser null
        String focus,
        String status,
        LocalDateTime createdAt
) {
    public static AdminTrainingDTO fromEntity(Training t) {
        return new AdminTrainingDTO(
                t.getId(),
                t.getUser().getName(),
                null, // Lógica de personal se houver vínculo direto
                t.getFocus(),
                t.getStatus().name(),
                t.getCreatedAt()
        );
    }
}