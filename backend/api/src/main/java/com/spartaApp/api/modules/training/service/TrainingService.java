package com.spartaApp.api.modules.training.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spartaApp.api.modules.anamnese.domain.Anamnesis;
import com.spartaApp.api.modules.anamnese.dto.AnamnesisSummaryDTO;
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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    private static final Logger log = LoggerFactory.getLogger(TrainingService.class);

    @Autowired
    private com.spartaApp.api.modules.anamnese.repository.AnamnesisRepository anamnesisRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private TrainingSetRepository trainingSetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${sparta.n8n.webhook-url}")
    private String n8nWebhookUrl;

    @Transactional
    public TrainingResponseDTO createTrainingRequest(UUID userId, CreateTrainingDTO data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.ACTIVE)
                .ifPresent(t -> {
                    throw new RuntimeException("Você já possui um treino ativo. Arquive-o antes de solicitar um novo.");
                });

        Training training = new Training();
        training.setUser(user);
        training.setLevel(data.level());
        training.setFocus(data.focus());
        training.setDaysPerWeek(data.daysPerWeek());
        training.setLimitations(data.limitations());
        training.setStatus(TrainingStatus.DRAFT);

        Training saved = trainingRepository.save(training);
        entityManager.flush();

        log.info("✅ Treino {} salvo no banco.", saved.getId());

        return TrainingResponseDTO.fromEntity(saved);
    }

    @Async
    public void triggerAI(TrainingResponseDTO trainingDto) {
        try {
            Thread.sleep(1000); // Delay de segurança transacional

            Map<String, Object> payload = new HashMap<>();

            // Dados básicos do pedido
            payload.put("trainingId", trainingDto.id().toString());
            payload.put("userId", trainingDto.userId().toString());
            payload.put("userName", trainingDto.userName());
            payload.put("level", trainingDto.level());
            payload.put("focus", trainingDto.focus());
            payload.put("daysPerWeek", trainingDto.daysPerWeek());

            // --- LÓGICA DE ANAMNESE ---
            var anamnesisOpt = anamnesisRepository.findByUserIdAndActiveTrue(trainingDto.userId());

            if (anamnesisOpt.isPresent()) {
                var a = anamnesisOpt.get();
                // Envia dados clínicos se existirem
                payload.put("age", a.getAge());
                payload.put("weight", a.getWeight());
                payload.put("injuries", a.getInjuries()); // Lesões reais
                payload.put("medicalConditions", a.getMedicalConditions());
                payload.put("limitations", a.getInjuries() != null ? a.getInjuries() : "Nenhuma");
            } else {
                // Fallback: usa o campo limitations do DTO se não tiver anamnese
                payload.put("limitations", trainingDto.limitations() != null ? trainingDto.limitations() : "Nenhuma");
                payload.put("age", "Não informado");
                payload.put("injuries", "Não informado");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            log.info("🚀 Disparando webhook n8n (Async) para treino {} -> {}", trainingDto.id(), n8nWebhookUrl);

            restTemplate.postForEntity(n8nWebhookUrl, request, String.class);

            log.info("✅ Webhook n8n disparado com sucesso");

        } catch (Exception e) {
            log.error("❌ Erro ao disparar webhook n8n: {}", e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public TrainingResponseDTO processN8nResponse(AIProcessedTrainingDTO aiData) {
        log.info("📥 Processando resposta da IA para treino {}", aiData.trainingId());

        entityManager.clear();

        Training training = trainingRepository.findById(aiData.trainingId())
                .orElseThrow(() -> {
                    log.error("❌ Training ID {} não encontrado no banco!", aiData.trainingId());
                    return new RuntimeException("Treino base não encontrado para o ID fornecido.");
                });

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> metadata = Map.of(
                    "planName", aiData.planName(),
                    "description", aiData.description()
            );
            training.setContent(mapper.writeValueAsString(metadata));
        } catch (Exception e) {
            log.error("Erro ao serializar metadata", e);
        }

        for (AIProcessedTrainingDTO.WorkoutDay workout : aiData.workouts()) {
            for (AIProcessedTrainingDTO.ExerciseSet exerciseDTO : workout.exercises()) {

                Exercise exercise = exerciseRepository.findById(exerciseDTO.exerciseId())
                        .orElseThrow(() -> new RuntimeException(
                                "Exercício inválido retornado pela IA: " + exerciseDTO.exerciseId()
                        ));

                TrainingSet set = new TrainingSet();
                set.setTraining(training);
                set.setExerciseId(exercise.getId());
                set.setExerciseName(exercise.getName());
                set.setDayLetter(workout.dayLetter());
                set.setExerciseOrder(exerciseDTO.order());
                set.setSets(exerciseDTO.sets());
                set.setReps(exerciseDTO.reps());
                set.setRestSeconds(exerciseDTO.restSeconds());
                set.setLoadPrescription(exerciseDTO.loadPrescription());
                set.setTechnique(exerciseDTO.technique());
                set.setNotes(exerciseDTO.notes());

                training.addSet(set);
            }
        }

        training.setStatus(TrainingStatus.PENDING_REVIEW);
        Training saved = trainingRepository.save(training);

        return TrainingResponseDTO.fromEntity(saved);
    }

    public List<TrainingResponseDTO> listPendingTrainings() {
        return trainingRepository.findPendingReviewOrDraft().stream()
                .map(TrainingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /** Lista treinos pendentes (DRAFT ou PENDING_REVIEW) com anamnese do aluno para o profissional avaliar. */
    public List<PendingReviewDTO> listPendingReviewsWithAnamnesis() {
        List<PendingReviewDTO> result = new ArrayList<>();
        for (Training t : trainingRepository.findPendingReviewOrDraft()) {
            TrainingResponseDTO trainingDto = TrainingResponseDTO.fromEntity(t);
            AnamnesisSummaryDTO anamnesisDto = null;
            Optional<Anamnesis> anamnesisOpt = anamnesisRepository.findByUserIdAndActiveTrue(t.getUser().getId());
            if (anamnesisOpt.isPresent()) {
                anamnesisDto = AnamnesisSummaryDTO.fromEntity(anamnesisOpt.get());
            }
            result.add(new PendingReviewDTO(trainingDto, anamnesisDto));
        }
        return result;
    }

    @Transactional
    public TrainingResponseDTO updateTraining(UUID trainingId, UpdateTrainingDTO data) {
        Training training = trainingRepository.findByIdWithSets(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        trainingSetRepository.deleteByTrainingId(trainingId);
        training.getSets().clear();

        for (UpdateTrainingDTO.SetUpdate setUpdate : data.sets()) {
            var exercise = exerciseRepository.findById(setUpdate.exerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));

            TrainingSet set = new TrainingSet();
            set.setTraining(training);
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

    @Transactional
    public TrainingResponseDTO approveTraining(UUID trainingId, ApproveTrainingDTO data) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        if (data.approved()) {
            trainingRepository.findByUserIdAndStatus(training.getUser().getId(), TrainingStatus.ACTIVE)
                    .ifPresent(old -> {
                        old.setStatus(TrainingStatus.ARCHIVED);
                        trainingRepository.save(old);
                    });

            training.setStatus(TrainingStatus.ACTIVE);
            log.info("✅ Treino {} aprovado e ativado", trainingId);
        } else {
            training.setStatus(TrainingStatus.DRAFT);
            log.info("❌ Treino {} rejeitado", trainingId);
        }

        Training updated = trainingRepository.save(training);
        return TrainingResponseDTO.fromEntity(updated);
    }

    public TrainingResponseDTO getMyActiveTraining(UUID userId) {
        Training training = trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.APPROVED)
                .or(() -> trainingRepository.findByUserIdAndStatus(userId, TrainingStatus.ACTIVE))
                .orElseThrow(() -> new RuntimeException("Você não possui treino aprovado no momento"));

        return TrainingResponseDTO.fromEntity(training);
    }

    public List<TrainingResponseDTO> listAllTrainings() {
        return trainingRepository.findAll().stream()
                .map(TrainingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}