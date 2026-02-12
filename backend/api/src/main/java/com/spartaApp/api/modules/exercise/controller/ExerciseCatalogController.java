package com.spartaApp.api.modules.exercise.controller;

import com.spartaApp.api.modules.exercise.dto.ExerciseCatalogDTO;
import com.spartaApp.api.modules.exercise.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller específico para fornecer catálogo de exercícios
 * em formato otimizado para IA (n8n + Gemini)
 */
@RestController
@RequestMapping("/exercises")
public class ExerciseCatalogController {

    @Autowired
    private ExerciseService service;

    /**
     * GET /exercises/catalog
     * Retorna lista simplificada de exercícios para ser usada pela IA
     * 
     * Formato otimizado:
     * - Apenas campos essenciais (reduz tokens)
     * - JSON compacto
     * - Cache-friendly
     */
    @GetMapping("/catalog")
    public ResponseEntity<List<ExerciseCatalogDTO>> getCatalogForAI() {
        var catalog = service.getCatalogForAI();
        return ResponseEntity.ok(catalog);
    }

    /**
     * GET /exercises/catalog/by-group/{group}
     * Retorna exercícios filtrados por grupo muscular
     * Útil se o catálogo crescer muito (>100 exercícios)
     */
    @GetMapping("/catalog/by-group/{group}")
    public ResponseEntity<List<ExerciseCatalogDTO>> getCatalogByGroup(
            @PathVariable String group
    ) {
        var catalog = service.getCatalogByGroup(group);
        return ResponseEntity.ok(catalog);
    }
}
