package com.spartaApp.api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Desabilita CSRF pois usamos Token/Stateless
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Aplica a config de CORS abaixo
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 0. Preflight CORS (OPTIONS) sem token — precisa passar para o GET com Authorization funcionar
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 1. Endpoints Públicos (Login e Registro)
                        .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register").permitAll()

                        // 2. Webhooks (n8n/IA)
                        .requestMatchers(HttpMethod.POST, "/trainings/webhook/**").permitAll()

                        // 3. Catálogo de Exercícios (Leitura pública se necessário, ou mude para authenticated)
                        .requestMatchers(HttpMethod.GET, "/exercises/catalog").permitAll()

                        // 4. Swagger / Docs (Opcional, bom deixar liberado em dev)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 5. Assistente (chat) — permitAll; auth checada no controller
                        .requestMatchers(HttpMethod.POST, "/assistant/chat").permitAll()
                        .requestMatchers("/assistant/**").permitAll()

                        // 6. Rotas do Personal (ADMIN pode acessar como “página Personal”)
                        .requestMatchers(HttpMethod.GET, "/trainings/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/trainings/*").authenticated()
                        .requestMatchers(HttpMethod.POST, "/trainings/*/approve").authenticated()

                        // 7. Todo o resto exige autenticação
                        .anyRequest().authenticated()
                )
                // JWT antes da decisão de autorização (403); lê Authorization: Bearer
                .addFilterBefore(securityFilter, AuthorizationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // --- ORIGENS PERMITIDAS ---
        // Permite localhost (Frontend da Colaboradora e seu)
        // Permite IPs de rede local (Seu NAS/Celular)
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // React Vite (porta padrão)
                "http://localhost:3000", // Vite em outra porta
                "http://localhost:8080", // Própria API
                "*"                      // Redes locais/Mobile (cuidado em produção)
        ));

        // --- MÉTODOS PERMITIDOS ---
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));

        // --- HEADERS PERMITIDOS ---
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",    // Crucial para o Bearer Token
                "Content-Type",     // JSON
                "X-Sparta-Api-Key", // Webhook n8n
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        configuration.setAllowCredentials(true); // Permite Cookies/Auth Headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}