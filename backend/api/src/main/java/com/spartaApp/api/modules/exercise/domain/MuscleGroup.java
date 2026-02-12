package com.spartaApp.api.modules.exercise.domain;

public enum MuscleGroup {
    CHEST("Peito"),
    BACK("Costas"),
    LEGS("Pernas"),
    SHOULDERS("Ombros"),
    BICEPS("Bíceps"),
    TRICEPS("Tríceps"),
    CORE("Abdômen/Core"),
    CARDIO("Cardio");

    private final String description;

    MuscleGroup(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}