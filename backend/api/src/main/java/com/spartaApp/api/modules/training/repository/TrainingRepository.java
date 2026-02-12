package com.spartaApp.api.modules.training.repository;

import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingRepository extends JpaRepository<Training, UUID> {

    // Buscar treinos de um aluno específico
    List<Training> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Buscar treinos por status
    List<Training> findByStatusOrderByCreatedAtDesc(TrainingStatus status);

    // Buscar treino ativo de um aluno (só pode ter 1 ativo por vez)
    Optional<Training> findByUserIdAndStatus(UUID userId, TrainingStatus status);

    // Buscar todos os treinos pendentes de revisão (para o Personal)
    @Query("SELECT t FROM Training t WHERE t.status = 'PENDING_REVIEW' ORDER BY t.createdAt ASC")
    List<Training> findPendingReview();

    // Buscar treino com sets carregados (evita N+1)
    @Query("SELECT t FROM Training t LEFT JOIN FETCH t.sets WHERE t.id = :id")
    Optional<Training> findByIdWithSets(@Param("id") UUID id);
}
