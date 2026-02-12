package com.spartaApp.api.modules.session.repository;

import com.spartaApp.api.modules.session.domain.TrainingSessionSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrainingSessionSetRepository extends JpaRepository<TrainingSessionSet, UUID> {
    List<TrainingSessionSet> findBySessionId(UUID sessionId);
}