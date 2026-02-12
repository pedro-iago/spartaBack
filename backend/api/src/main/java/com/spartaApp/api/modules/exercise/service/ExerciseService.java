package com.spartaApp.api.modules.exercise.service;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import com.spartaApp.api.modules.exercise.domain.MuscleGroup;
import com.spartaApp.api.modules.exercise.dto.CreateExerciseDTO;
import com.spartaApp.api.modules.exercise.dto.ExerciseCatalogDTO;
import com.spartaApp.api.modules.exercise.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository repository;

    public Exercise createExercise(CreateExerciseDTO data) {
        Exercise exercise = new Exercise();

        // Mapeamento DTO -> Entidade
        exercise.setName(data.name());
        exercise.setMuscleGroup(data.muscleGroup());
        exercise.setTargetMuscle(data.targetMuscle());
        exercise.setSecondaryMuscles(data.secondaryMuscles());
        exercise.setMechanics(data.mechanics());
        exercise.setEquipment(data.equipment());
        exercise.setDescription(data.description());
        exercise.setVideoUrl(data.videoUrl());

        // Valor padrão se não vier preenchido
        exercise.setDifficultyLevel(data.difficultyLevel() != null ? data.difficultyLevel() : "BEGINNER");

        // Padrões de sistema
        exercise.setIsCustom(false);
        exercise.setActive(true);

        return repository.save(exercise);
    }

    public List<Exercise> listAll() {
        return repository.findByActiveTrue();
    }

    public List<Exercise> listByGroup(MuscleGroup group) {
        return repository.findByMuscleGroupAndActiveTrue(group);
    }

    // ============================================
    // MÉTODOS PARA IA (n8n + Gemini)
    // ============================================

    /**
     * Retorna catálogo simplificado para IA
     * Formato otimizado (reduz tokens)
     */
    public List<ExerciseCatalogDTO> getCatalogForAI() {
        return repository.findByActiveTrue().stream()
                .map(ExerciseCatalogDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retorna catálogo filtrado por grupo muscular
     * Útil quando o catálogo crescer
     */
    public List<ExerciseCatalogDTO> getCatalogByGroup(String groupName) {
        try {
            MuscleGroup group = MuscleGroup.valueOf(groupName.toUpperCase());
            return repository.findByMuscleGroupAndActiveTrue(group).stream()
                    .map(ExerciseCatalogDTO::fromEntity)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }
}
