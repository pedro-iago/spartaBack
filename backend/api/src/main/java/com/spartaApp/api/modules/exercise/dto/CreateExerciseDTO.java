package com.spartaApp.api.modules.exercise.dto;

import com.spartaApp.api.modules.exercise.domain.MuscleGroup;

public record CreateExerciseDTO(
        String name,
        MuscleGroup muscleGroup,
        String targetMuscle,
        String secondaryMuscles,
        String mechanics,
        String equipment,
        String description,
        String videoUrl,
        String difficultyLevel
) {}