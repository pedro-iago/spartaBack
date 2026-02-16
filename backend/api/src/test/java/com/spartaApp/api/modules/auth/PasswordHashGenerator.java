package com.spartaApp.api.modules.auth;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Rode este teste UMA VEZ para gerar o hash BCrypt da senha "bia123".
 * Use o hash no SQL para atualizar o usuário inserido manualmente:
 *
 * UPDATE tb_users SET password = '<hash_gerado>' WHERE email = 'bianca@teste.com';
 */
class PasswordHashGenerator {

    @Test
    void printBcryptHashForBia123() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senha = "bia123";
        String hash = encoder.encode(senha);
        System.out.println("========================================");
        System.out.println("Senha: " + senha);
        System.out.println("Hash BCrypt (use no UPDATE):");
        System.out.println(hash);
        System.out.println("========================================");
        System.out.println("SQL: UPDATE tb_users SET password = '" + hash + "' WHERE email = 'bianca@teste.com';");
        System.out.println("========================================");
    }
}
