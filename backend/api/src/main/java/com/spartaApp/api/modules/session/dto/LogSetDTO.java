package com.spartaApp.api.modules.session.dto;

import java.util.UUID;

public record LogSetDTO(
        UUID plannedSetId, // ID do set original (da ficha)
        Integer repsCompleted,
        Double weightUsed,
        Boolean failure
) {}