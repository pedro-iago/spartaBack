package com.spartaApp.api.modules.session.dto;

import java.util.UUID;

public record StartSessionDTO(
        UUID trainingId, // O ID do treino (ficha) que ele vai usar
        String dayLetter // "A", "B", "C"
) {}