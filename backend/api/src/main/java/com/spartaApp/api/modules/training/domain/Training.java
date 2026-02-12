package com.spartaApp.api.modules.training.domain;

import com.spartaApp.api.modules.auth.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_trainings")
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // --- Relacionamento com Usuário ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // --- Protocolo da Anamnese ---
    @Column(nullable = false, length = 50)
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(nullable = false, length = 50)
    private String focus; // HYPERTROPHY, STRENGTH, ENDURANCE

    @Column(name = "days_per_week", nullable = false)
    private Integer daysPerWeek; // 3, 4, 5...

    @Column(columnDefinition = "TEXT")
    private String limitations; // Lesões, restrições

    // --- Treino Gerado pela IA (Backup JSON) ---
    @Column(columnDefinition = "JSONB")
    private String content; // JSON original da IA

    // --- Séries Estruturadas (RELAÇÃO PRINCIPAL) ---
    @OneToMany(mappedBy = "training", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainingSet> sets = new ArrayList<>();

    // --- Status do Treino ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TrainingStatus status = TrainingStatus.DRAFT;

    // --- Auditoria ---
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Métodos Auxiliares ---
    public void addSet(TrainingSet set) {
        sets.add(set);
        set.setTraining(this);
    }

    public void removeSet(TrainingSet set) {
        sets.remove(set);
        set.setTraining(null);
    }
}
