package com.spartaApp.api.modules.anamnese.dto;

public record CreateAnamnesisDTO(
        Double weight,
        Double height,
        Integer age,
        String gender, // "MALE", "FEMALE"
        String goal,   // "HYPERTROPHY", "WEIGHT_LOSS"
        String activityLevel, // "SEDENTARY", "ACTIVE"
        Integer daysPerWeekAvailable,
        String injuries,
        String medicalConditions
) {}