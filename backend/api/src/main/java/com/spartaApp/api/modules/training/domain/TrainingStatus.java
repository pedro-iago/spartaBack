package com.spartaApp.api.modules.training.domain;

public enum TrainingStatus {
    DRAFT("Rascunho - IA gerou, aguardando revisão"),
    PENDING_REVIEW("Aguardando aprovação do Personal"),
    APPROVED("Aprovado - Aluno pode executar"),
    ACTIVE("Ativo - Aluno está executando"),
    COMPLETED("Concluído - Ciclo finalizado"),
    ARCHIVED("Arquivado - Substituído por novo treino");

    private final String description;

    TrainingStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
