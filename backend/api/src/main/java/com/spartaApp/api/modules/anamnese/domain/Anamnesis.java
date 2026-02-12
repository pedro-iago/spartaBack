package com.spartaApp.api.modules.anamnese.domain;

import com.spartaApp.api.modules.auth.domain.User;
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
@Table(name = "tb_anamnesis")
public class Anamnesis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Dados Físicos
    private Double weight; // kg
    private Double height; // m
    private Integer age;

    @Column(length = 50)
    private String gender; // MALE, FEMALE

    // Objetivos e Nível
    @Column(nullable = false)
    private String goal; // HYPERTROPHY, WEIGHT_LOSS...

    @Column(nullable = false)
    private String activityLevel; // SEDENTARY, ACTIVE...

    private Integer daysPerWeekAvailable;

    // Saúde
    @Column(columnDefinition = "TEXT")
    private String injuries; // Lesões

    @Column(columnDefinition = "TEXT")
    private String medicalConditions;

    @Column(nullable = false)
    private Boolean active = true; // Apenas uma ativa por vez

    @CreationTimestamp
    private LocalDateTime createdAt;
}