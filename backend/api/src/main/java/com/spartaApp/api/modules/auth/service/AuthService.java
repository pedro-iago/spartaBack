package com.spartaApp.api.modules.auth.service;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole;
import com.spartaApp.api.modules.auth.dto.LoginDTO;
import com.spartaApp.api.modules.auth.dto.RegisterDTO;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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
        var user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(data.password(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }
        return user;
    }
}