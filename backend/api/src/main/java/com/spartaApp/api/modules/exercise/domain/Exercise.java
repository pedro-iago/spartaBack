package com.spartaApp.api.modules.exercise.domain;

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
@Table(name = "tb_exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // --- Identificação ---
    @Column(nullable = false, unique = true) // Garante unicidade conforme o índice do SQL
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String videoUrl;

    // --- Classificação Técnica ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MuscleGroup muscleGroup; // CHEST, BACK, etc.

    @Column(nullable = false)
    private String targetMuscle;     // Ex: "Peitoral Maior"

    private String secondaryMuscles; // Ex: "Tríceps"

    @Column(nullable = false)
    private String mechanics;        // COMPOSTO ou ISOLADO

    @Column(nullable = false)
    private String equipment;        // Peso Livre, Máquina...

    private String difficultyLevel;  // BEGINNER, INTERMEDIATE...

    // --- Controle ---
    private Boolean isCustom = false; // false = oficial do app

    private UUID createdByUserId;     // null se for oficial

    private Boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}