package com.spartaApp.api.modules.training.dto;

import com.spartaApp.api.modules.anamnese.dto.AnamnesisSummaryDTO;

/**
 * Item de revisão pendente: treino + anamnese do aluno para o profissional avaliar.
 */
public record PendingReviewDTO(
        TrainingResponseDTO training,
        AnamnesisSummaryDTO anamnesis
) {}
