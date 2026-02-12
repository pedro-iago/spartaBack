package com.spartaApp.api.modules.session.domain;

import com.spartaApp.api.modules.training.domain.TrainingSet;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_training_session_sets")
public class TrainingSessionSet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TrainingSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planned_set_id", nullable = false)
    private TrainingSet plannedSet;

    @Column(name = "reps_completed")
    private Integer repsCompleted;

    @Column(name = "weight_used")
    private Double weightUsed;

    @Column(name = "rpe")
    private Integer rpe;

    // 🔥 CAMPOS FALTANTES QUE CAUSAVAM ERRO setCompleted e setFailure
    @Column(nullable = false)
    private Boolean completed;

    @Column(nullable = false)
    private Boolean failure = false; // Se foi até a falha

    @CreationTimestamp
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}