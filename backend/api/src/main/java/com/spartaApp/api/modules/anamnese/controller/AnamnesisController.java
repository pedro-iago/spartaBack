package com.spartaApp.api.modules.anamnese.controller;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.anamnese.dto.AnamnesisResponseDTO;
import com.spartaApp.api.modules.anamnese.dto.CreateAnamnesisDTO;
import com.spartaApp.api.modules.anamnese.service.AnamnesisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/anamnesis")
public class AnamnesisController {

    @Autowired
    private AnamnesisService anamnesisService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @Secured("ROLE_USER")
    public ResponseEntity<AnamnesisResponseDTO> create(
            @RequestBody CreateAnamnesisDTO data,
            Authentication auth
    ) {
        UUID userId = getUserId(auth);
        var created = anamnesisService.createAnamnesis(userId, data);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/current")
    @Secured("ROLE_USER")
    public ResponseEntity<AnamnesisResponseDTO> getCurrent(Authentication auth) {
        UUID userId = getUserId(auth);
        var active = anamnesisService.getActiveAnamnesis(userId);

        if (active == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(active);
    }

    private UUID getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return user.getId();
    }
}