package com.spartaApp.api.modules.auth.controller;

import com.spartaApp.api.modules.auth.dto.LoginDTO;
import com.spartaApp.api.modules.auth.dto.RegisterDTO;
import com.spartaApp.api.modules.auth.service.AuthService;
import com.spartaApp.api.modules.auth.service.TokenService;
import com.spartaApp.api.modules.auth.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody RegisterDTO data) {
        try {
            var user = authService.registerStudent(data);
            return ResponseEntity.ok("Aluno cadastrado! ID: " + user.getId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-personal")
    public ResponseEntity<?> registerPersonal(
            @RequestBody RegisterDTO data,
            @RequestHeader(value = "X-Admin-Secret", required = false) String adminSecret
    ) {
        // Trava simples para evitar que qualquer um crie conta de Personal no MVP
        if (!"sparta-secret-2024".equals(adminSecret)) {
            return ResponseEntity.status(403).body("Chave de autorização inválida para cadastro de Personal.");
        }

        try {
            var user = authService.registerPersonal(data);
            return ResponseEntity.ok("Personal cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO data) {
        try {
            var user = authService.login(data);
            String token = tokenService.generateToken(user);

            ResponseCookie cookie = ResponseCookie.from("auth_token", token)
                    .httpOnly(true)
                    .secure(false) // Mudar para true em produção (HTTPS)
                    .path("/")
                    .maxAge(86400)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthResponse(user.getName(), user.getRole().toString(), token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    /** Teste de autenticação: retorna dados do usuário logado (qualquer role). Útil para validar se o token está sendo aceito. */
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new AuthMeResponse(user.getEmail(), user.getName(), user.getRole().toString()));
    }

    record AuthResponse(String name, String role, String token) {}
    record AuthMeResponse(String email, String name, String role) {}
}