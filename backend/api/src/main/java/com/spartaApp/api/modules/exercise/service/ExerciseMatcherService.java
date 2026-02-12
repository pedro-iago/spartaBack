package com.spartaApp.api.modules.exercise.service;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import com.spartaApp.api.modules.exercise.domain.MuscleGroup;
import com.spartaApp.api.modules.exercise.repository.ExerciseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * Service responsável por fazer match entre nomes de exercícios vindos da IA
 * e os exercícios cadastrados no banco de dados.
 * 
 * Estratégia de Match:
 * 1. Tenta match exato (case-insensitive)
 * 2. Tenta match parcial (contém o nome)
 * 3. Tenta match por similaridade (normalizado)
 * 4. Se falhar, cria exercício temporário (isCustom=true)
 */
@Service
public class ExerciseMatcherService {

    private static final Logger log = LoggerFactory.getLogger(ExerciseMatcherService.class);

    @Autowired
    private ExerciseRepository exerciseRepository;

    /**
     * Encontra um exercício do catálogo pelo nome retornado pela IA
     */
    public UUID matchExercise(String aiExerciseName) {
        log.info("Tentando match para exercício: {}", aiExerciseName);

        // 1. Match exato
        Optional<Exercise> exact = findExactMatch(aiExerciseName);
        if (exact.isPresent()) {
            log.info("✅ Match exato encontrado: {}", exact.get().getName());
            return exact.get().getId();
        }

        // 2. Match parcial
        Optional<Exercise> partial = findPartialMatch(aiExerciseName);
        if (partial.isPresent()) {
            log.warn("⚠️ Match parcial encontrado: {} para input: {}", 
                partial.get().getName(), aiExerciseName);
            return partial.get().getId();
        }

        // 3. Match normalizado
        Optional<Exercise> normalized = findNormalizedMatch(aiExerciseName);
        if (normalized.isPresent()) {
            log.warn("⚠️ Match normalizado encontrado: {} para input: {}", 
                normalized.get().getName(), aiExerciseName);
            return normalized.get().getId();
        }

        // 4. Não encontrou - cria exercício temporário
        log.error("❌ Exercício não encontrado no catálogo: {}", aiExerciseName);
        return createTemporaryExercise(aiExerciseName);
    }

    /**
     * Match exato (ignora case e espaços extras)
     */
    private Optional<Exercise> findExactMatch(String name) {
        String normalized = normalizeName(name);
        return exerciseRepository.findByActiveTrue().stream()
            .filter(e -> normalizeName(e.getName()).equals(normalized))
            .findFirst();
    }

    /**
     * Match parcial (busca se contém)
     * Ex: "Supino" encontra "Supino Reto com Barra"
     */
    private Optional<Exercise> findPartialMatch(String name) {
        String normalized = normalizeName(name);
        return exerciseRepository.findByActiveTrue().stream()
            .filter(e -> normalizeName(e.getName()).contains(normalized) ||
                        normalized.contains(normalizeName(e.getName())))
            .findFirst();
    }

    /**
     * Match normalizado (remove acentos, pontuação, etc)
     */
    private Optional<Exercise> findNormalizedMatch(String name) {
        String superNormalized = superNormalize(name);
        return exerciseRepository.findByActiveTrue().stream()
            .filter(e -> {
                String exerciseName = superNormalize(e.getName());
                return exerciseName.contains(superNormalized) ||
                       superNormalized.contains(exerciseName) ||
                       calculateSimilarity(exerciseName, superNormalized) > 0.7;
            })
            .findFirst();
    }

    /**
     * Cria exercício temporário quando não encontra no catálogo
     * Marca como isCustom=true para revisão posterior
     */
    private UUID createTemporaryExercise(String name) {
        Exercise temp = new Exercise();
        temp.setName(name);
        temp.setMuscleGroup(guessMuscleGroup(name)); // Tenta adivinhar grupo
        temp.setTargetMuscle("Não especificado");
        temp.setMechanics("COMPOSTO"); // Default seguro
        temp.setEquipment("Variado");
        temp.setIsCustom(true); // Marca como temporário
        temp.setActive(true);
        temp.setDescription("⚠️ Exercício criado automaticamente pela IA. Revisar!");

        Exercise saved = exerciseRepository.save(temp);
        log.warn("🆕 Exercício temporário criado: {} (ID: {})", name, saved.getId());
        return saved.getId();
    }

    /**
     * Normaliza nome: lowercase, remove espaços extras
     */
    private String normalizeName(String name) {
        return name.toLowerCase().trim().replaceAll("\\s+", " ");
    }

    /**
     * Super normalização: remove acentos, pontuação
     */
    private String superNormalize(String name) {
        return normalizeName(name)
            .replaceAll("[áàâã]", "a")
            .replaceAll("[éèê]", "e")
            .replaceAll("[íì]", "i")
            .replaceAll("[óòôõ]", "o")
            .replaceAll("[úù]", "u")
            .replaceAll("[ç]", "c")
            .replaceAll("[^a-z0-9\\s]", ""); // Remove pontuação
    }

    /**
     * Calcula similaridade entre strings (algoritmo simples)
     * Retorna valor entre 0 e 1
     */
    private double calculateSimilarity(String s1, String s2) {
        String longer = s1.length() > s2.length() ? s1 : s2;
        String shorter = s1.length() > s2.length() ? s2 : s1;

        if (longer.length() == 0) return 1.0;

        int matches = 0;
        for (char c : shorter.toCharArray()) {
            if (longer.indexOf(c) >= 0) matches++;
        }

        return (double) matches / longer.length();
    }

    /**
     * Tenta adivinhar grupo muscular pelo nome
     */
    private MuscleGroup guessMuscleGroup(String name) {
        String lower = name.toLowerCase();

        if (lower.contains("supino") || lower.contains("peito") || lower.contains("chest") || 
            lower.contains("crucifixo") || lower.contains("peck")) {
            return MuscleGroup.CHEST;
        }
        if (lower.contains("remada") || lower.contains("pulldown") || lower.contains("puxada") || 
            lower.contains("costas") || lower.contains("back")) {
            return MuscleGroup.BACK;
        }
        if (lower.contains("agachamento") || lower.contains("leg press") || lower.contains("squat") || 
            lower.contains("perna") || lower.contains("coxa") || lower.contains("quadriceps")) {
            return MuscleGroup.LEGS;
        }
        if (lower.contains("desenvolvimento") || lower.contains("elevacao lateral") || 
            lower.contains("ombro") || lower.contains("shoulder")) {
            return MuscleGroup.SHOULDERS;
        }
        if (lower.contains("rosca") || lower.contains("biceps") || lower.contains("curl")) {
            return MuscleGroup.BICEPS;
        }
        if (lower.contains("triceps") || lower.contains("extensao") || lower.contains("frances")) {
            return MuscleGroup.TRICEPS;
        }
        if (lower.contains("abdominal") || lower.contains("prancha") || lower.contains("core")) {
            return MuscleGroup.CORE;
        }

        // Default: CHEST (grupo comum)
        return MuscleGroup.CHEST;
    }
}
