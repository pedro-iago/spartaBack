package com.spartaApp.api.modules.training.repository;

import com.spartaApp.api.modules.admin.dto.TimeSeriesDTO; // ⚠️ Import Novo
import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingRepository extends JpaRepository<Training, UUID> {

    // --- MÉTODOS EXISTENTES ---
    List<Training> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Training> findByStatusOrderByCreatedAtDesc(TrainingStatus status);
    Optional<Training> findByUserIdAndStatus(UUID userId, TrainingStatus status);

    @Query("SELECT t FROM Training t WHERE t.status = 'PENDING_REVIEW' ORDER BY t.createdAt ASC")
    List<Training> findPendingReview();

    @Query("SELECT t FROM Training t LEFT JOIN FETCH t.sets WHERE t.id = :id")
    Optional<Training> findByIdWithSets(@Param("id") UUID id);

    // --- NOVOS MÉTODOS PARA O ADMIN ---

    // 1. Contagem para os Cards (Total Ativos, Pendentes, etc)
    long countByStatus(TrainingStatus status);

    // 2. Gráfico: Treinos Criados por Período
    @Query(value = "SELECT TO_CHAR(created_at, :pattern) as date, COUNT(*) as value " +
            "FROM tb_trainings " +
            "GROUP BY TO_CHAR(created_at, :pattern) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<TimeSeriesDTO> findTrainingCreationMetric(@Param("pattern") String pattern);
}