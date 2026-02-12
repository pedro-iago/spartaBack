package com.spartaApp.api.modules.training.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.exercise.domain.Exercise;
import com.spartaApp.api.modules.exercise.repository.ExerciseRepository;
import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingSet;
import com.spartaApp.api.modules.training.domain.TrainingStatus;
import com.spartaApp.api.modules.training.dto.*;
import com.spartaApp.api.modules.training.repository.TrainingRepository;
import com.spartaApp.api.modules.training.repository.TrainingSetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    private static final Logger log = LoggerFactory.getLogger(TrainingService.class);

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private TrainingSetRepository trainingSetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private ExerciseMatcherService exerciseMatcherService;

    // ============================================
    // 1. ALUNO: Solicitar Novo Treino (Anamnese)
    // ============================================
    @Transactional
    public TrainingResponseDTO createTrainingRequest(UUID userId, CreateTrainingDTO data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verificar se já tem treino ativo
        trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.ACTIVE)
                .ifPresent(t -> {
                    throw new RuntimeException("Você já possui um treino ativo. Arquive-o antes de solicitar um novo.");
                });

        // Criar registro DRAFT
        Training training = new Training();
        training.setUser(user);
        training.setLevel(data.level());
        training.setFocus(data.focus());
        training.setDaysPerWeek(data.daysPerWeek());
        training.setLimitations(data.limitations());
        training.setStatus(TrainingStatus.DRAFT);

        Training saved = trainingRepository.save(training);

        // TODO: Aqui você dispara o webhook para n8n + IA
        // triggerAIGeneration(saved);

        return TrainingResponseDTO.fromEntity(saved);
    }

    // ============================================
    // 2. SISTEMA: Processar Resposta da IA (FORMATO ATUAL)
    // ============================================
    @Transactional
    public void processAIResponseWithNames(UUID trainingId, AITrainingResponseDTO aiResponse) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        // Salvar JSON original (backup)
        try {
            ObjectMapper mapper = new ObjectMapper();
            training.setContent(mapper.writeValueAsString(aiResponse));
        } catch (Exception e) {
            log.error("Erro ao serializar resposta da IA", e);
        }

        // Processar cada dia de treino
        String[] dayLetters = {"A", "B", "C", "D", "E", "F"};
        int dayIndex = 0;

        for (AITrainingResponseDTO.WorkoutDay workout : aiResponse.treinos()) {
            String dayLetter = dayLetters[dayIndex++];
            int exerciseOrder = 1;

            for (AITrainingResponseDTO.ExerciseInfo exerciseDTO : workout.exercicios()) {
                
                // ⭐ AQUI O MATCH ACONTECE ⭐
                UUID exerciseId = exerciseMatcherService.matchExercise(exerciseDTO.nome());
                
                // Buscar exercício para pegar nome oficial
                Exercise exercise = exerciseRepository.findById(exerciseId)
                        .orElseThrow(() -> new RuntimeException("Exercício não encontrado após match!"));

                // Criar TrainingSet
                TrainingSet set = new TrainingSet();
                set.setExerciseId(exercise.getId());
                set.setExerciseName(exercise.getName()); // Nome oficial do banco
                set.setDayLetter(dayLetter);
                set.setExerciseOrder(exerciseOrder++);
                set.setSets(exerciseDTO.series());
                set.setReps(exerciseDTO.reps());
                set.setRestSeconds(exerciseDTO.getRestSeconds());
                set.setLoadPrescription(exerciseDTO.load_prescription());
                set.setTechnique(exerciseDTO.tecnica());

                training.addSet(set);
            }
        }

        // Atualizar status para aguardar revisão
        training.setStatus(TrainingStatus.PENDING_REVIEW);
        trainingRepository.save(training);
    }

    // ============================================
    // 2B. SISTEMA: Processar Resposta da IA (FORMATO IDEAL COM IDs)
    // ============================================
    @Transactional
    public void processAIResponse(UUID trainingId, String jsonContent, List<TrainingSetDTO> sets) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        // Salvar JSON original (backup)
        training.setContent(jsonContent);

        // Converter DTOs em entidades e adicionar ao treino
        for (TrainingSetDTO setDTO : sets) {
            var exercise = exerciseRepository.findById(setDTO.exerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercício não encontrado: " + setDTO.exerciseId()));

            TrainingSet set = new TrainingSet();
            set.setExerciseId(exercise.getId());
            set.setExerciseName(exercise.getName());
            set.setDayLetter(setDTO.dayLetter());
            set.setExerciseOrder(setDTO.exerciseOrder());
            set.setSets(setDTO.sets());
            set.setReps(setDTO.reps());
            set.setRestSeconds(setDTO.restSeconds());
            set.setLoadPrescription(setDTO.loadPrescription());
            set.setTechnique(setDTO.technique());
            set.setNotes(setDTO.notes());

            training.addSet(set);
        }

        // Atualizar status para aguardar revisão
        training.setStatus(TrainingStatus.PENDING_REVIEW);
        trainingRepository.save(training);
    }

    // ============================================
    // 3. PERSONAL: Listar Treinos Pendentes
    // ============================================
    public List<TrainingResponseDTO> listPendingTrainings() {
        return trainingRepository.findPendingReview().stream()
                .map(TrainingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ============================================
    // 4. PERSONAL: Editar Treino
    // ============================================
    @Transactional
    public TrainingResponseDTO updateTraining(UUID trainingId, UpdateTrainingDTO data) {
        Training training = trainingRepository.findByIdWithSets(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        // Limpar séries antigas
        trainingSetRepository.deleteByTrainingId(trainingId);
        training.getSets().clear();

        // Adicionar novas séries
        for (UpdateTrainingDTO.SetUpdate setUpdate : data.sets()) {
            var exercise = exerciseRepository.findById(setUpdate.exerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));

            TrainingSet set = new TrainingSet();
            set.setExerciseId(exercise.getId());
            set.setExerciseName(exercise.getName());
            set.setDayLetter(setUpdate.dayLetter());
            set.setExerciseOrder(setUpdate.exerciseOrder());
            set.setSets(setUpdate.sets());
            set.setReps(setUpdate.reps());
            set.setRestSeconds(setUpdate.restSeconds());
            set.setLoadPrescription(setUpdate.loadPrescription());
            set.setTechnique(setUpdate.technique());
            set.setNotes(setUpdate.notes());

            training.addSet(set);
        }

        Training updated = trainingRepository.save(training);
        return TrainingResponseDTO.fromEntity(updated);
    }

    // ============================================
    // 5. PERSONAL: Aprovar/Rejeitar Treino
    // ============================================
    @Transactional
    public TrainingResponseDTO approveTraining(UUID trainingId, ApproveTrainingDTO data) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        if (data.approved()) {
            training.setStatus(TrainingStatus.APPROVED);
            // TODO: Enviar notificação ao aluno
        } else {
            training.setStatus(TrainingStatus.DRAFT);
            // TODO: Enviar feedback ao aluno
        }

        Training updated = trainingRepository.save(training);
        return TrainingResponseDTO.fromEntity(updated);
    }

    // ============================================
    // 6. ALUNO: Ver Meu Treino Aprovado
    // ============================================
    public TrainingResponseDTO getMyActiveTraining(UUID userId) {
        Training training = trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.APPROVED)
                .or(() -> trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.ACTIVE))
                .orElseThrow(() -> new RuntimeException("Você não possui treino aprovado no momento"));

        return TrainingResponseDTO.fromEntity(training);
    }

    // ============================================
    // 7. ALUNO: Marcar Série como Concluída
    // ============================================
    @Transactional
    public void completeSet(UUID setId, String actualLoad) {
        TrainingSet set = trainingSetRepository.findById(setId)
                .orElseThrow(() -> new RuntimeException("Série não encontrada"));

        set.setSetsCompleted(set.getSetsCompleted() + 1);
        set.setActualLoad(actualLoad);

        if (set.getSetsCompleted() >= set.getSets()) {
            set.setCompletedAt(java.time.LocalDateTime.now());
        }

        trainingSetRepository.save(set);
    }

    // ============================================
    // 8. ADMIN: Listar Todos os Treinos
    // ============================================
    public List<TrainingResponseDTO> listAllTrainings() {
        return trainingRepository.findAll().stream()
                .map(TrainingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
