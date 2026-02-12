package com.spartaApp.api.modules.exercise.controller;

import com.spartaApp.api.modules.exercise.domain.Exercise;
import com.spartaApp.api.modules.exercise.domain.MuscleGroup;
import com.spartaApp.api.modules.exercise.dto.CreateExerciseDTO;
import com.spartaApp.api.modules.exercise.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService service;

    // ROTA 1: Criar Exercício (Só ADM ou PERSONAL)
    @PostMapping
    @Secured({"ROLE_ADMIN", "ROLE_PERSONAL"})
    public ResponseEntity<Exercise> create(@RequestBody CreateExerciseDTO data) {
        var exercise = service.createExercise(data);
        return ResponseEntity.ok(exercise);
    }

    // ROTA 2: Listar Todos (Aberto a todos logados)
    @GetMapping
    public ResponseEntity<List<Exercise>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    // ROTA 3: Filtrar por Grupo (Ex: /exercises/group/CHEST)
    @GetMapping("/group/{groupName}")
    public ResponseEntity<List<Exercise>> listByGroup(@PathVariable String groupName) {
        try {
            MuscleGroup group = MuscleGroup.valueOf(groupName.toUpperCase());
            return ResponseEntity.ok(service.listByGroup(group));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}