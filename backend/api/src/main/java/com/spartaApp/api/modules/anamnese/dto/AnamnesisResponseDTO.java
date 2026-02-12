package com.spartaApp.api.modules.anamnese.dto;

import com.spartaApp.api.modules.anamnese.domain.Anamnesis;
import java.time.LocalDateTime;
import java.util.UUID;

public record AnamnesisResponseDTO(
        UUID id,
        Double weight,
        Double height,
        Integer age,
        String goal,
        String injuries,
        LocalDateTime createdAt
) {
    public static AnamnesisResponseDTO fromEntity(Anamnesis entity) {
        return new AnamnesisResponseDTO(
                entity.getId(),
                entity.getWeight(),
                entity.getHeight(),
                entity.getAge(),
                entity.getGoal(),
                entity.getInjuries(),
                entity.getCreatedAt()
        );
    }
}