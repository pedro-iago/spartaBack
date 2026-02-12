package com.spartaApp.api.modules.training.controller;

import com.spartaApp.api.modules.training.dto.*;
import com.spartaApp.api.modules.training.service.TrainingService;
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

    @Autowired
    private TrainingService service;

    // ============================================
    // ROTAS DO ALUNO
    // ============================================

    /**
     * POST /trainings/request
     * Aluno solicita novo treino preenchendo anamnese
     */
    @PostMapping("/request")
    @Secured("ROLE_USER")
    public ResponseEntity<TrainingResponseDTO> requestTraining(
            @RequestBody CreateTrainingDTO data,
            Authentication auth
    ) {
        UUID userId = getUserIdFromAuth(auth);
        var training = service.createTrainingRequest(userId, data);
        return ResponseEntity.ok(training);
    }

    /**
     * GET /trainings/my-active
     * Aluno busca seu treino aprovado/ativo
     */
    @GetMapping("/my-active")
    @Secured("ROLE_USER")
    public ResponseEntity<TrainingResponseDTO> getMyActiveTraining(Authentication auth) {
        UUID userId = getUserIdFromAuth(auth);
        var training = service.getMyActiveTraining(userId);
        return ResponseEntity.ok(training);
    }

    /**
     * POST /trainings/sets/{setId}/complete
     * Aluno marca uma série como concluída
     */
    @PostMapping("/sets/{setId}/complete")
    @Secured("ROLE_USER")
    public ResponseEntity<?> completeSet(
            @PathVariable UUID setId,
            @RequestBody CompleteSetRequest request
    ) {
        service.completeSet(setId, request.actualLoad());
        return ResponseEntity.ok("Série registrada com sucesso!");
    }

    // ============================================
    // ROTAS DO PERSONAL
    // ============================================

    /**
     * GET /trainings/pending
     * Personal lista todos os treinos aguardando aprovação
     */
    @GetMapping("/pending")
    @Secured("ROLE_PERSONAL")
    public ResponseEntity<List<TrainingResponseDTO>> listPendingTrainings() {
        var trainings = service.listPendingTrainings();
        return ResponseEntity.ok(trainings);
    }

    /**
     * PUT /trainings/{id}
     * Personal edita o treino (adicionar/remover exercícios, ajustar séries)
     */
    @PutMapping("/{id}")
    @Secured("ROLE_PERSONAL")
    public ResponseEntity<TrainingResponseDTO> updateTraining(
            @PathVariable UUID id,
            @RequestBody UpdateTrainingDTO data
    ) {
        var updated = service.updateTraining(id, data);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /trainings/{id}/approve
     * Personal aprova ou rejeita o treino
     */
    @PostMapping("/{id}/approve")
    @Secured("ROLE_PERSONAL")
    public ResponseEntity<TrainingResponseDTO> approveTraining(
            @PathVariable UUID id,
            @RequestBody ApproveTrainingDTO data
    ) {
        var training = service.approveTraining(id, data);
        return ResponseEntity.ok(training);
    }

    // ============================================
    // ROTAS DO ADMIN
    // ============================================

    /**
     * GET /trainings/all
     * Admin lista todos os treinos do sistema
     */
    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<List<TrainingResponseDTO>> listAllTrainings() {
        var trainings = service.listAllTrainings();
        return ResponseEntity.ok(trainings);
    }

    // ============================================
    // WEBHOOK (PÚBLICO - Protegido por secret no n8n)
    // ============================================

    /**
     * POST /trainings/webhook/ai-response
     * n8n envia o JSON gerado pela IA
     */
    @PostMapping("/webhook/ai-response")
    public ResponseEntity<?> receiveAIResponse(@RequestBody AIWebhookPayload payload) {
        // TODO: Validar secret do n8n para segurança
        service.processAIResponse(
                payload.trainingId(),
                payload.jsonContent(),
                payload.sets()
        );
        return ResponseEntity.ok("Treino processado com sucesso!");
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    private UUID getUserIdFromAuth(Authentication auth) {
        // Assumindo que você tem o UUID no token JWT
        // Adapte conforme sua implementação do TokenService
        return UUID.fromString(auth.getName());
    }

    // Records auxiliares
    record CompleteSetRequest(String actualLoad) {}
    record AIWebhookPayload(UUID trainingId, String jsonContent, List<TrainingSetDTO> sets) {}
}
