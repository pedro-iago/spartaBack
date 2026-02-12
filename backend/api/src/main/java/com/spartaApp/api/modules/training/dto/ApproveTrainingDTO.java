package com.spartaApp.api.modules.training.dto;

public record ApproveTrainingDTO(
        Boolean approved,      // true = aprova, false = rejeita
        String feedback        // Mensagem opcional para o aluno
) {}
