package com.spartaApp.api.modules.training.controller;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.training.dto.*;
import com.spartaApp.api.modules.training.service.TrainingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trainings")
public class TrainingController {

    private static final Logger log = LoggerFactory.getLogger(TrainingController.class);

    @Autowired
    private TrainingService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/request")
    @Secured("ROLE_USER")
    public ResponseEntity<TrainingResponseDTO> requestTraining(
            @RequestBody CreateTrainingDTO data,
            Authentication auth
    ) {
        try {
            UUID userId = getUserIdFromAuth(auth);
            log.info("📝 Aluno {} solicitou novo treino", userId);

            var training = service.createTrainingRequest(userId, data);
            service.triggerAI(training); // Async

            return ResponseEntity.ok(training);
        } catch (Exception e) {
            log.error("❌ Erro ao criar treino: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/my-active")
    @Secured("ROLE_USER")
    public ResponseEntity<TrainingResponseDTO> getMyActiveTraining(Authentication auth) {
        try {
            UUID userId = getUserIdFromAuth(auth);
            var training = service.getMyActiveTraining(userId);
            return ResponseEntity.ok(training);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ❌ REMOVIDO endpoint /sets/{setId}/complete

    @GetMapping("/pending")
    public ResponseEntity<List<TrainingResponseDTO>> listPendingTrainings() {
        var trainings = service.listPendingTrainings();
        return ResponseEntity.ok(trainings);
    }

    /** Treinos pendentes com anamnese do aluno para o profissional avaliar. (Path em 2 segmentos para não conflitar com PUT /{id}) */
    @GetMapping("/reviews/pending")
    public ResponseEntity<List<PendingReviewDTO>> listPendingReviewsWithAnamnesis() {
        var list = service.listPendingReviewsWithAnamnesis();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    @Secured({"ROLE_PERSONAL", "ROLE_ADMIN"})
    public ResponseEntity<TrainingResponseDTO> updateTraining(
            @PathVariable UUID id,
            @RequestBody UpdateTrainingDTO data
    ) {
        try {
            var updated = service.updateTraining(id, data);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{id}/approve")
    @Secured({"ROLE_PERSONAL", "ROLE_ADMIN"})
    public ResponseEntity<TrainingResponseDTO> approveTraining(
            @PathVariable UUID id,
            @RequestBody ApproveTrainingDTO data
    ) {
        try {
            var training = service.approveTraining(id, data);
            return ResponseEntity.ok(training);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<List<TrainingResponseDTO>> listAllTrainings() {
        var trainings = service.listAllTrainings();
        return ResponseEntity.ok(trainings);
    }

    @PostMapping("/webhook/ai-response")
    public ResponseEntity<?> receiveAIResponse(
            @RequestBody AIProcessedTrainingDTO payload,
            @RequestHeader(value = "X-Sparta-Api-Key", required = false) String apiKey
    ) {
        if (!"132522!Ip#2026!".equals(apiKey)) return ResponseEntity.status(403).build();

        try {
            var training = service.processN8nResponse(payload);
            return ResponseEntity.ok(training);
        } catch (Exception e) {
            log.error("💥 Erro ao processar resposta da IA", e);
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    private UUID getUserIdFromAuth(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return user.getId();
    }
}