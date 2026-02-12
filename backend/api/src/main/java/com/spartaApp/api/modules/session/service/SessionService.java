package com.spartaApp.api.modules.session.service;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
// ⚠️ ATENÇÃO AQUI: Importar as classes do SEU domínio, não do Spring Web
import com.spartaApp.api.modules.session.domain.SessionStatus;
import com.spartaApp.api.modules.session.domain.TrainingSession;
import com.spartaApp.api.modules.session.domain.TrainingSessionSet;
import com.spartaApp.api.modules.session.dto.*;
import com.spartaApp.api.modules.session.repository.TrainingSessionRepository;
import com.spartaApp.api.modules.session.repository.TrainingSessionSetRepository;
import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingSet;
import com.spartaApp.api.modules.training.repository.TrainingRepository;
import com.spartaApp.api.modules.training.repository.TrainingSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SessionService {

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private TrainingSessionSetRepository sessionSetRepository;

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private TrainingSetRepository trainingSetRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public SessionResponseDTO startSession(UUID userId, StartSessionDTO data) {
        // Verifica se já existe sessão em andamento
        sessionRepository.findByUserIdAndStatus(userId, SessionStatus.IN_PROGRESS)
                .ifPresent(s -> {
                    throw new RuntimeException("Você já tem uma sessão em andamento! Finalize-a antes de iniciar outra.");
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Training training = trainingRepository.findById(data.trainingId())
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));

        TrainingSession session = new TrainingSession();
        session.setUser(user);
        session.setTraining(training);
        session.setDayLetter(data.dayLetter()); // Agora vai funcionar
        session.setStartedAt(LocalDateTime.now());
        session.setStatus(SessionStatus.IN_PROGRESS);
        session.setTotalVolumeLoad(0.0);

        TrainingSession saved = sessionRepository.save(session);
        return SessionResponseDTO.fromEntity(saved);
    }

    @Transactional
    public SessionResponseDTO logSet(UUID sessionId, LogSetDTO data) {
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        if (session.getStatus() != SessionStatus.IN_PROGRESS) {
            throw new RuntimeException("Esta sessão já foi finalizada.");
        }

        TrainingSet plannedSet = trainingSetRepository.findById(data.plannedSetId())
                .orElseThrow(() -> new RuntimeException("Série planejada não encontrada"));

        TrainingSessionSet execution = new TrainingSessionSet();
        execution.setSession(session);
        execution.setPlannedSet(plannedSet);
        execution.setRepsCompleted(data.repsCompleted());
        execution.setWeightUsed(data.weightUsed());
        execution.setFailure(data.failure()); // Agora vai funcionar
        execution.setCompleted(true);

        sessionSetRepository.save(execution);

        // Adiciona na lista em memória para o retorno correto
        session.getExecutedSets().add(execution);

        return SessionResponseDTO.fromEntity(session);
    }

    @Transactional
    public SessionResponseDTO finishSession(UUID sessionId) {
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        if (session.getStatus() == SessionStatus.FINISHED) {
            throw new RuntimeException("Sessão já está finalizada.");
        }

        // Calcula o volume total
        double totalVolume = session.getExecutedSets().stream()
                .mapToDouble(s -> s.getWeightUsed() * s.getRepsCompleted())
                .sum();

        session.setTotalVolumeLoad(totalVolume);
        session.setFinishedAt(LocalDateTime.now());
        session.setStatus(SessionStatus.FINISHED);

        TrainingSession saved = sessionRepository.save(session);
        return SessionResponseDTO.fromEntity(saved);
    }

    public List<SessionResponseDTO> getHistory(UUID userId) {
        return sessionRepository.findByUserIdAndStatusOrderByFinishedAtDesc(userId, SessionStatus.FINISHED)
                .stream()
                .map(SessionResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SessionResponseDTO getCurrentSession(UUID userId) {
        return sessionRepository.findByUserIdAndStatus(userId, SessionStatus.IN_PROGRESS)
                .map(SessionResponseDTO::fromEntity)
                .orElse(null);
    }
}