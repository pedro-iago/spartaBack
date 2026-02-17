package com.spartaApp.api.modules.auth;

import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.domain.UserRole;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Teste utilitário para criar diretamente no banco os usuários padrão:
 *
 * - professional@sparta.com / 123  (role PERSONAL)
 * - aluno@sparta.com        / 123  (role STUDENT)
 * - admin@sparta.com        / 123  (role ADMIN)
 *
 * Rode este teste UMA VEZ no IntelliJ/VS Code (Run 'DefaultUsersPasswordGenerator')
 * com o Postgres rodando. Ele usa o contexto Spring da aplicação e grava via JPA.
 */
@SpringBootTest
class DefaultUsersPasswordGenerator {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void createDefaultUsersWithPassword123() {
        String rawPassword = "123";
        String encoded = passwordEncoder.encode(rawPassword);

        createIfNotExists(
                "professional@sparta.com",
                "Profissional Sparta",
                encoded,
                UserRole.PERSONAL
        );

        createIfNotExists(
                "aluno@sparta.com",
                "Aluno Sparta",
                encoded,
                UserRole.STUDENT
        );

        createIfNotExists(
                "admin@sparta.com",
                "Admin Sparta",
                encoded,
                UserRole.ADMIN
        );

        System.out.println("========================================");
        System.out.println("Usuários padrão garantidos no banco:");
        System.out.println("- professional@sparta.com (PERSONAL) / senha: 123");
        System.out.println("- aluno@sparta.com        (STUDENT)  / senha: 123");
        System.out.println("- admin@sparta.com        (ADMIN)   / senha: 123");
        System.out.println("========================================");
    }

    private void createIfNotExists(String email, String name, String encodedPassword, UserRole role) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> System.out.printf("Já existe usuário com email %s (role: %s)%n", email, user.getRole()),
                () -> {
                    User user = new User(name, email, encodedPassword, role);
                    userRepository.save(user);
                    System.out.printf("Criado usuário %s com role %s%n", email, role);
                }
        );
    }
}