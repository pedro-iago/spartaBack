package com.spartaApp.api.modules.admin.dto;

import com.spartaApp.api.modules.auth.domain.User;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminUserDTO(
        UUID id,
        String name,
        String email,
        String role,
        Boolean active,
        LocalDateTime createdAt
) {
    public static AdminUserDTO fromEntity(User user) {
        return new AdminUserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                // ⚠️ CORREÇÃO: Extraímos o nome do Enum para String
                user.getRole().toString(),
                user.getActive(),
                user.getCreatedAt()
        );
    }
}