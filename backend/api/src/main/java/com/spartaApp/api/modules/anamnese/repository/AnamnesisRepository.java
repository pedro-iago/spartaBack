package com.spartaApp.api.modules.anamnese.repository;

import com.spartaApp.api.modules.anamnese.domain.Anamnesis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AnamnesisRepository extends JpaRepository<Anamnesis, UUID> {
    // Busca a anamnese ativa do usuário (caso ele tenha várias no histórico)
    Optional<Anamnesis> findByUserIdAndActiveTrue(UUID userId);
}