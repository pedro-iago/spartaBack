package com.spartaApp.api.modules.session.repository;

import com.spartaApp.api.modules.admin.dto.TimeSeriesDTO; // ⚠️ Import Novo
import com.spartaApp.api.modules.session.domain.SessionStatus;
import com.spartaApp.api.modules.session.domain.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // ⚠️ Import Novo

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {

    // --- MÉTODOS EXISTENTES ---
    Optional<TrainingSession> findByUserIdAndStatus(UUID userId, SessionStatus status);
    List<TrainingSession> findByUserIdAndStatusOrderByFinishedAtDesc(UUID userId, SessionStatus status);

    @Query("SELECT SUM(s.totalVolumeLoad) FROM TrainingSession s WHERE s.user.id = :userId AND s.status = 'FINISHED'")
    Double sumTotalVolumeByUserId(@Param("userId") UUID userId);

    // --- NOVOS MÉTODOS PARA O ADMIN ---

    // 1. Gráfico: Total de Sessões Executadas por Período
    @Query(value = "SELECT TO_CHAR(finished_at, :pattern) as date, COUNT(*) as value " +
            "FROM tb_training_sessions " +
            "WHERE status = 'FINISHED' " +
            "GROUP BY TO_CHAR(finished_at, :pattern) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<TimeSeriesDTO> findSessionExecutionMetric(@Param("pattern") String pattern);

    // 2. Gráfico: Alunos Únicos Ativos por Período
    @Query(value = "SELECT TO_CHAR(finished_at, :pattern) as date, COUNT(DISTINCT user_id) as value " +
            "FROM tb_training_sessions " +
            "WHERE status = 'FINISHED' " +
            "GROUP BY TO_CHAR(finished_at, :pattern) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<TimeSeriesDTO> findActiveStudentsMetric(@Param("pattern") String pattern);
}