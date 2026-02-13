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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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
                        // 1. Endpoints Públicos (Login e Registro)
                        .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register").permitAll()

                        // 2. Webhooks (n8n/IA)
                        .requestMatchers(HttpMethod.POST, "/trainings/webhook/**").permitAll()

                        // 3. Catálogo de Exercícios (Leitura pública se necessário, ou mude para authenticated)
                        .requestMatchers(HttpMethod.GET, "/exercises/catalog").permitAll()

                        // 4. Swagger / Docs (Opcional, bom deixar liberado em dev)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 5. Todo o resto exige autenticação
                        .anyRequest().authenticated()
                )
                // Adiciona seu filtro de segurança (JWT) antes do filtro padrão do Spring
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // --- ORIGENS PERMITIDAS ---
        // Permite localhost (Frontend da Colaboradora e seu)
        // Permite IPs de rede local (Seu NAS/Celular)
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // React Vite Local
                "http://localhost:8080", // Própria API
                "*"                      // Redes locais/Mobile (cuidado em produção, mas ok para dev)
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