package com.spartaApp.api.modules.admin.dto;

public record AdminDashboardDTO(
        long totalUsers,
        long totalStudents,
        long totalPersonals,
        long totalTrainings,
        long pendingReviews,
        long activeTrainings,
        long archivedTrainings
) {}