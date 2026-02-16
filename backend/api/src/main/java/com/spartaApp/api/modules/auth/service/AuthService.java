package com.spartaApp.api.modules.auth.service;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole;
import com.spartaApp.api.modules.auth.dto.LoginDTO;
import com.spartaApp.api.modules.auth.dto.RegisterDTO;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- CADASTRO ALUNO (PÚBLICO) ---
    public User registerStudent(RegisterDTO data) {
        if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new RuntimeException("E-mail já existe!");
        }

        User newUser = new User(
                data.name(),
                data.email(),
                passwordEncoder.encode(data.password()),
                UserRole.STUDENT // <--- TRAVA DE SEGURANÇA: Sempre Aluno!
        );

        return userRepository.save(newUser);
    }

    // --- CADASTRO PERSONAL (LINK SECRETO) ---
    public User registerPersonal(RegisterDTO data) {
        if (userRepository.findByEmail(data.email()).isPresent()) {
            throw new RuntimeException("E-mail já existe!");
        }

        User newUser = new User(
                data.name(),
                data.email(),
                passwordEncoder.encode(data.password()),
                UserRole.PERSONAL // <--- Cria Personal
        );

        return userRepository.save(newUser);
    }

    public User login(LoginDTO data) {
        log.info("[LOGIN] Tentativa para email: {}", data.email());
        var userOpt = userRepository.findByEmail(data.email());
        if (userOpt.isEmpty()) {
            log.warn("[LOGIN] 401 - Usuário NÃO encontrado: {}", data.email());
            throw new RuntimeException("Email ou senha inválidos");
        }
        var user = userOpt.get();
        String stored = user.getPassword();
        String plain = data.password();

        // Senha em formato BCrypt: validação normal
        if (stored != null && (stored.startsWith("$2a$") || stored.startsWith("$2b$"))) {
            if (!passwordEncoder.matches(plain, stored)) {
                log.warn("[LOGIN] 401 - Senha NÃO confere para: {}", data.email());
                throw new RuntimeException("Email ou senha inválidos");
            }
        } else {
            // Senha legada/corrompida (não parece BCrypt): aceita texto puro e migra para BCrypt
            if (stored == null || !stored.equals(plain)) {
                log.warn("[LOGIN] 401 - Senha NÃO confere para: {}", data.email());
                throw new RuntimeException("Email ou senha inválidos");
            }
            log.info("[LOGIN] Migrando senha para BCrypt: {}", data.email());
            user.setPassword(passwordEncoder.encode(plain));
            userRepository.save(user);
        }

        log.info("[LOGIN] OK para: {}", data.email());
        return user;
    }
}