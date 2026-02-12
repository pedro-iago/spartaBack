package com.spartaApp.api.modules.session.domain;

public enum SessionStatus {
    IN_PROGRESS, // O aluno clicou em "Iniciar Treino"
    FINISHED,    // O aluno clicou em "Finalizar"
    CANCELED     // O aluno desistiu no meio
}