package com.spartaApp.api.modules.admin.service;

import com.spartaApp.api.modules.admin.dto.*;
import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole; // ⚠️ Import do Enum
import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.session.repository.TrainingSessionRepository;
import com.spartaApp.api.modules.training.domain.Training;
import com.spartaApp.api.modules.training.domain.TrainingStatus;
import com.spartaApp.api.modules.training.repository.TrainingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private TrainingRepository trainingRepository;
    @Autowired private TrainingSessionRepository sessionRepository;

    // --- 1. Gestão de Usuários ---

    public List<AdminUserDTO> listAllUsers() {
        return userRepository.findAll().stream()
                .map(AdminUserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateUserRole(UUID userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        try {
            // ⚠️ CORREÇÃO: Converte a String do Front (ex: "PERSONAL") para o Enum do Java
            UserRole roleEnum = UserRole.valueOf(newRole.toUpperCase());
            user.setRole(roleEnum);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role inválida. Valores aceitos: ADMIN, PERSONAL, STUDENT");
        }
    }

    @Transactional
    public void toggleUserStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    // --- 2. Gestão Global de Treinos ---

    public List<AdminTrainingDTO> listAllTrainings() {
        return trainingRepository.findAll().stream()
                .map(AdminTrainingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void forceArchiveTraining(UUID trainingId) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new RuntimeException("Treino não encontrado"));
        training.setStatus(TrainingStatus.ARCHIVED);
        trainingRepository.save(training);
    }

    // --- 3. Métricas (Dashboard) ---

    public AdminDashboardDTO getDashboardSummary() {
        return new AdminDashboardDTO(
                userRepository.count(),
                // ⚠️ CORREÇÃO: Passando o Enum em vez de String solta
                userRepository.countByRole(UserRole.STUDENT),
                userRepository.countByRole(UserRole.PERSONAL),
                trainingRepository.count(),
                trainingRepository.countByStatus(TrainingStatus.PENDING_REVIEW),
                trainingRepository.countByStatus(TrainingStatus.ACTIVE),
                trainingRepository.countByStatus(TrainingStatus.ARCHIVED)
        );
    }

    // Helper para converter ENUM de período para padrão SQL do Postgres
    private String getSqlPattern(String period) {
        switch (period.toUpperCase()) {
            case "DAY": return "YYYY-MM-DD";
            case "MONTH": return "YYYY-MM";
            case "YEAR": return "YYYY";
            default: return "YYYY-MM-DD";
        }
    }

    public List<TimeSeriesDTO> getUserGrowthMetric(String period) {
        return userRepository.findUserGrowthMetric(getSqlPattern(period));
    }

    public List<TimeSeriesDTO> getTrainingCreationMetric(String period) {
        return trainingRepository.findTrainingCreationMetric(getSqlPattern(period));
    }

    public List<TimeSeriesDTO> getSessionExecutionMetric(String period) {
        return sessionRepository.findSessionExecutionMetric(getSqlPattern(period));
    }

    public List<TimeSeriesDTO> getActiveStudentsMetric(String period) {
        return sessionRepository.findActiveStudentsMetric(getSqlPattern(period));
    }
}