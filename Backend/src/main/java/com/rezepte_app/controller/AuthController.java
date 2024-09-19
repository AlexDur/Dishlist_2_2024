package com.rezepte_app.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import com.rezepte_app.LoginRequest;
import com.rezepte_app.config.JwtConfig;  // JwtConfig importieren
import com.rezepte_app.model.User;
import com.rezepte_app.model.VerificationToken;
import com.rezepte_app.repository.UserRepository;
import com.rezepte_app.repository.VerificationTokenRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtConfig jwtConfig;  // JwtConfig injizieren

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Benutzername bereits vergeben";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false); // Nutzer ist erst nach der Bestätigung aktiviert

        userRepository.save(user);

        // Token generieren
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user);
        tokenRepository.save(verificationToken);

        return "Registrierung erfolgreich. Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.";
    }

    @GetMapping("/confirm")
    public String confirmAccount(@RequestParam("token") String token) {
        Optional<VerificationToken> optionalVerificationToken = tokenRepository.findByToken(token);

        if (optionalVerificationToken.isPresent()) {
            VerificationToken verificationToken = optionalVerificationToken.get();
            User user = verificationToken.getUser();

            // Benutzer aktivieren
            user.setEnabled(true);
            userRepository.save(user);

            return "Konto bestätigt. Sie können sich jetzt anmelden.";
        } else {
            return "Token ungültig oder abgelaufen";
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, String> response = new HashMap<>();
        try {
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // Set the authentication into the SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // JWT-Token generieren
            String jwtToken = generateJwtToken(authentication);

            response.put("message", "Login erfolgreich");
            response.put("token", jwtToken); // JWT-Token zurückgeben
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            response.put("message", "Login fehlgeschlagen");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Methode zur Erstellung des JWT-Tokens
    private String generateJwtToken(Authentication authentication) {
        try {
            SecretKey secretKey = jwtConfig.getSecretKey();  // Schlüssel aus JwtConfig beziehen
            return Jwts.builder()
                    .setSubject(authentication.getName())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + 86400000)) // 24 Stunden Gültigkeit
                    .signWith(secretKey, SignatureAlgorithm.HS512) // Signatur mit dem SecretKey
                    .compact();
        } catch (Exception e) {
            logger.error("Error generating JWT token", e);
            throw new RuntimeException("JWT Token creation failed");
        }
    }
}
