package com.rezepte_app.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    private final SecretKey secretKey;

    public JwtConfig(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes()); // Konvertiert den String-Schlüssel in ein SecretKey-Objekt
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }
}
