package com.spartaApp.api.modules.auth.repository;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole; // ⚠️ Importante
import com.spartaApp.api.modules.admin.dto.TimeSeriesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    // ⚠️ Correção: Mudou de String para UserRole
    long countByRole(UserRole role);

    // Query de gráfico (continua igual)
    @Query(value = "SELECT TO_CHAR(created_at, :pattern) as date, COUNT(*) as value " +
            "FROM tb_users " +
            "GROUP BY TO_CHAR(created_at, :pattern) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<TimeSeriesDTO> findUserGrowthMetric(@Param("pattern") String pattern);
}