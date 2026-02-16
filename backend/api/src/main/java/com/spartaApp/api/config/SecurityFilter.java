package com.spartaApp.api.config;

import com.spartaApp.api.modules.auth.repository.UserRepository;
import com.spartaApp.api.modules.auth.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(SecurityFilter.class);

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = recoverTokenFromCookie(request);
        String source = token != null ? "cookie" : null;
        if (token == null) {
            token = recoverTokenFromHeader(request);
            source = token != null ? "header" : null;
        }

        if (token != null) {
            log.info("Token recebido (origin: {}), validando...", source);
            String login = tokenService.validateToken(token);
            if (login != null) {
                var user = userRepository.findByEmail(login).orElse(null);
                if (user != null && Boolean.TRUE.equals(user.getActive())) {
                    var authorities = user.getAuthorities();
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Auth OK ({}): {} roles={}", source, login,
                            authorities.stream().map(org.springframework.security.core.GrantedAuthority::getAuthority).toList());
                } else if (user == null) {
                    log.warn("Token válido mas usuário não encontrado: {}", login);
                } else if (!Boolean.TRUE.equals(user.getActive())) {
                    log.warn("Usuário inativo: {}", login);
                }
            } else {
                log.warn("Token inválido ou expirado (origin: {})", source);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recoverTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /** Frontend envia token em Authorization: Bearer <token> (localStorage). */
    private String recoverTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}