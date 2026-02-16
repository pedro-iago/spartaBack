package com.spartaApp.api.modules.anamnese.dto;

import com.spartaApp.api.modules.anamnese.domain.Anamnesis;

import java.time.LocalDateTime;
import java.util.UUID;

/** Resumo da anamnese para o profissional avaliar no dashboard. */
public record AnamnesisSummaryDTO(
        UUID id,
        Double weight,
        Double height,
        Integer age,
        String gender,
        String goal,
        String activityLevel,
        Integer daysPerWeekAvailable,
        String injuries,
        String medicalConditions,
        LocalDateTime createdAt
) {
    public static AnamnesisSummaryDTO fromEntity(Anamnesis a) {
        return new AnamnesisSummaryDTO(
                a.getId(),
                a.getWeight(),
                a.getHeight(),
                a.getAge(),
                a.getGender(),
                a.getGoal(),
                a.getActivityLevel(),
                a.getDaysPerWeekAvailable(),
                a.getInjuries(),
                a.getMedicalConditions(),
                a.getCreatedAt()
        );
    }
}
