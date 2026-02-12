package com.spartaApp.api.modules.session.domain;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.training.domain.Training;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_training_sessions")
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private Training training;

    // 🔥 ESTE CAMPO ESTAVA FALTANDO E CAUSAVA O ERRO setDayLetter
    @Column(name = "day_letter", nullable = false, length = 5)
    private String dayLetter;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.IN_PROGRESS;

    // 🔥 ESTE CAMPO ESTAVA FALTANDO E CAUSAVA O ERRO getExecutedSets
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainingSessionSet> executedSets = new ArrayList<>();

    @Column(name = "total_volume_load")
    private Double totalVolumeLoad = 0.0;

    @CreationTimestamp
    private LocalDateTime createdAt;
}