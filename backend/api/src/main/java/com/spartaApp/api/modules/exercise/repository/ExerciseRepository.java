package com.spartaApp.api.modules.exercise.repository;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import com.spartaApp.api.modules.exercise.domain.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    // Lista apenas os ativos
    List<Exercise> findByActiveTrue();

    // Filtra por grupo muscular (ex: buscar todos de COSTAS)
    List<Exercise> findByMuscleGroupAndActiveTrue(MuscleGroup muscleGroup);
}