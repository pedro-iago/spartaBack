package com.spartaApp.api.modules.auth.config;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seed simples para criar usuários padrão na base, caso não existam.
 *
 * - Profissional: professional@sparta.com / 123  (role PERSONAL)
 * - Aluno:       aluno@sparta.com        / 123  (role STUDENT)
 * - Admin:       admin@sparta.com        / 123  (role ADMIN)
 *
 * Pode ser removido ou ajustado depois do desenvolvimento.
 */
@Configuration
public class InitialUsersConfig {

    private static final Logger log = LoggerFactory.getLogger(InitialUsersConfig.class);

    @Bean
    public CommandLineRunner createDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createIfNotExists(
                    userRepository,
                    passwordEncoder,
                    "professional@sparta.com",
                    "Profissional Sparta",
                    "123",
                    UserRole.PERSONAL
            );

            createIfNotExists(
                    userRepository,
                    passwordEncoder,
                    "aluno@sparta.com",
                    "Aluno Sparta",
                    "123",
                    UserRole.STUDENT
            );

            createIfNotExists(
                    userRepository,
                    passwordEncoder,
                    "admin@sparta.com",
                    "Admin Sparta",
                    "123",
                    UserRole.ADMIN
            );
        };
    }

    private void createIfNotExists(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String email,
            String name,
            String rawPassword,
            UserRole role
    ) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> log.info("Usuário padrão já existe: {} ({})", email, role),
                () -> {
                    log.info("Criando usuário padrão: {} ({})", email, role);
                    User user = new User(
                            name,
                            email,
                            passwordEncoder.encode(rawPassword),
                            role
                    );
                    userRepository.save(user);
                }
        );
    }
}

