package com.spartaApp.api.modules.training.repository;

import com.spartaApp.api.modules.training.domain.TrainingSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrainingSetRepository extends JpaRepository<TrainingSet, UUID> {

    // Buscar todas as séries de um treino específico
    List<TrainingSet> findByTrainingIdOrderByDayLetterAscExerciseOrderAsc(UUID trainingId);

    // Buscar séries de um dia específico
    List<TrainingSet> findByTrainingIdAndDayLetterOrderByExerciseOrderAsc(UUID trainingId, String dayLetter);

    // Deletar todas as séries de um treino (útil para reconstrução)
    void deleteByTrainingId(UUID trainingId);
}
