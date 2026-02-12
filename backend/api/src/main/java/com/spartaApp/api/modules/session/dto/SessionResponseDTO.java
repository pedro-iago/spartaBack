package com.spartaApp.api.modules.session.dto;

import com.spartaApp.api.modules.session.domain.TrainingSession;
import com.spartaApp.api.modules.session.domain.SessionStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

public record SessionResponseDTO(
        UUID id,
        UUID trainingId,
        String dayLetter,
        LocalDateTime startedAt,
        LocalDateTime finishedAt,
        SessionStatus status,
        Double totalVolumeLoad,
        List<SessionSetResponseDTO> executedSets
) {
    public static SessionResponseDTO fromEntity(TrainingSession session) {
        return new SessionResponseDTO(
                session.getId(),
                session.getTraining().getId(),
                session.getDayLetter(),
                session.getStartedAt(),
                session.getFinishedAt(),
                session.getStatus(),
                session.getTotalVolumeLoad(),
                session.getExecutedSets().stream()
                        .map(SessionSetResponseDTO::fromEntity)
                        .collect(Collectors.toList())
        );
    }
}