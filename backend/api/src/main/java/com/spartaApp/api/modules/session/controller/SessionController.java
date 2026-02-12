package com.spartaApp.api.modules.session.controller;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.session.dto.LogSetDTO;
import com.spartaApp.api.modules.session.dto.SessionResponseDTO;
import com.spartaApp.api.modules.session.dto.StartSessionDTO;
import com.spartaApp.api.modules.session.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/start")
    @Secured("ROLE_USER")
    public ResponseEntity<SessionResponseDTO> startSession(
            @RequestBody StartSessionDTO data,
            Authentication auth
    ) {
        UUID userId = getUserId(auth);
        return ResponseEntity.ok(sessionService.startSession(userId, data));
    }

    @PostMapping("/{sessionId}/sets")
    @Secured("ROLE_USER")
    public ResponseEntity<SessionResponseDTO> logSet(
            @PathVariable UUID sessionId,
            @RequestBody LogSetDTO data
    ) {
        return ResponseEntity.ok(sessionService.logSet(sessionId, data));
    }

    @PostMapping("/{sessionId}/finish")
    @Secured("ROLE_USER")
    public ResponseEntity<SessionResponseDTO> finishSession(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(sessionService.finishSession(sessionId));
    }

    @GetMapping("/history")
    @Secured("ROLE_USER")
    public ResponseEntity<List<SessionResponseDTO>> getHistory(Authentication auth) {
        UUID userId = getUserId(auth);
        return ResponseEntity.ok(sessionService.getHistory(userId));
    }

    @GetMapping("/current")
    @Secured("ROLE_USER")
    public ResponseEntity<SessionResponseDTO> getCurrentSession(Authentication auth) {
        UUID userId = getUserId(auth);
        SessionResponseDTO current = sessionService.getCurrentSession(userId);
        if (current == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(current);
    }

    private UUID getUserId(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return user.getId();
    }
}