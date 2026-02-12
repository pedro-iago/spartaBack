package com.spartaApp.api.modules.training.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_training_sets")
public class TrainingSet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // --- Relacionamento com Treino ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id", nullable = false)
    private Training training;

    // --- Identificação do Exercício ---
    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    // --- Estrutura do Treino ---
    @Column(name = "day_letter", nullable = false, length = 10)
    private String dayLetter; // "A", "B", "C", "D"

    @Column(name = "exercise_order", nullable = false)
    private Integer exerciseOrder;

    // --- Prescrição (O Planejado) ---
    @Column(nullable = false)
    private Integer sets; // Número de séries alvo

    @Column(nullable = false, length = 50)
    private String reps; // Ex: "8-12"

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "load_prescription", length = 100)
    private String loadPrescription; // Ex: "70% 1RM"

    // --- Técnica/Observações ---
    @Column(length = 50)
    private String technique;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // --- Auditoria ---
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}