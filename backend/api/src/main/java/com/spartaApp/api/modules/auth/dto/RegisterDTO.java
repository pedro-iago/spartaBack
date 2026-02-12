package com.spartaApp.api.modules.auth.dto;

public record RegisterDTO(
        String name,
        String email,
        String password,
        String role // Recebe String do JSON, mas ignoramos no Service para segurança
) {}