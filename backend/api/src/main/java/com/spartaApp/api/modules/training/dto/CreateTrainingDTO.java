package com.spartaApp.api.modules.training.dto;

public record CreateTrainingDTO(
        String level,          // BEGINNER, INTERMEDIATE, ADVANCED
        String focus,          // HYPERTROPHY, STRENGTH, ENDURANCE
        Integer daysPerWeek,   // 3, 4, 5, 6
        String limitations     // Texto livre sobre lesões/restrições
) {}
