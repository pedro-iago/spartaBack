package com.spartaApp.api.modules.admin.controller;

import com.spartaApp.api.modules.admin.dto.*;
import com.spartaApp.api.modules.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@Secured("ROLE_ADMIN") // 🔒 Proteção Global do Módulo
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- Dashboard & Resumos ---
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    // --- Gestão de Usuários ---
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> listUsers() {
        return ResponseEntity.ok(adminService.listAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateRole(@PathVariable UUID id, @RequestBody UpdateRoleDTO dto) {
        adminService.updateUserRole(id, dto.newRole());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<Void> toggleStatus(@PathVariable UUID id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.noContent().build();
    }

    // --- Gestão de Treinos ---
    @GetMapping("/trainings")
    public ResponseEntity<List<AdminTrainingDTO>> listTrainings() {
        return ResponseEntity.ok(adminService.listAllTrainings());
    }

    @PutMapping("/trainings/{id}/archive")
    public ResponseEntity<Void> archiveTraining(@PathVariable UUID id) {
        adminService.forceArchiveTraining(id);
        return ResponseEntity.noContent().build();
    }

    // --- Métricas Temporais (Para Gráficos) ---
    // Exemplo de uso: GET /admin/metrics/users?period=MONTH

    @GetMapping("/metrics/users")
    public ResponseEntity<List<TimeSeriesDTO>> getUserMetrics(
            @RequestParam(defaultValue = "DAY") String period) {
        return ResponseEntity.ok(adminService.getUserGrowthMetric(period));
    }

    @GetMapping("/metrics/trainings")
    public ResponseEntity<List<TimeSeriesDTO>> getTrainingMetrics(
            @RequestParam(defaultValue = "DAY") String period) {
        return ResponseEntity.ok(adminService.getTrainingCreationMetric(period));
    }

    @GetMapping("/metrics/sessions")
    public ResponseEntity<List<TimeSeriesDTO>> getSessionMetrics(
            @RequestParam(defaultValue = "DAY") String period) {
        return ResponseEntity.ok(adminService.getSessionExecutionMetric(period));
    }

    @GetMapping("/metrics/active-students")
    public ResponseEntity<List<TimeSeriesDTO>> getActiveStudentsMetrics(
            @RequestParam(defaultValue = "DAY") String period) {
        return ResponseEntity.ok(adminService.getActiveStudentsMetric(period));
    }
}