package com.rezepte_app.controller;

import com.rezepte_app.dto.LoginRequest;
import com.rezepte_app.dto.NutzerRegistrierungDto;
import com.rezepte_app.dto.VerfikationCodeDto;
import com.rezepte_app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Hilfsmethode zur Erstellung von Standardantworten
    private ResponseEntity<Map<String, Object>> createResponse(boolean success, String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody NutzerRegistrierungDto registrierungDto) {
        try {
            authService.registerUser(registrierungDto.getEmail(), registrierungDto.getPassword());
            return ResponseEntity.ok("Registrierung erfolgreich");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registrierung fehlgeschlagen: " + e.getMessage());
        }
    }

    //HashMap um strukturierte Antwort mit mehreren Feldern im BE zu erzeugen
    @PostMapping("/verify-code")
    public  ResponseEntity<Map<String, Object>>  verifyCode(@RequestBody VerfikationCodeDto verifikationCodeDto) {
        String email = verifikationCodeDto.getEmail();
        String verifikationCode = verifikationCodeDto.getVerifikationCode();

        try {

            boolean isVerified = authService.verifyCode(email, verifikationCode);
            if (isVerified) {
                return createResponse(true, "Verifizierung erfolgreich", HttpStatus.OK);
            } else {
                return createResponse(false, "Verifizierung fehlgeschlagen: Ungültiger Code", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return createResponse(false, "Fehler bei der Verifizierung: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        try {

            // Validierung der Eingaben
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                response.put("success", false);
                response.put("message", "E-Mail und Passwort dürfen nicht null sein.");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {

            response.put("message", "Anmeldung fehlgeschlagen: " + (e.getMessage() != null ? e.getMessage() : "Unbekannter Fehler"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return createResponse(false, "Ungültiger Token", HttpStatus.UNAUTHORIZED);
        }

        String token = authorizationHeader.substring(7); // Entferne "Bearer "
        System.out.println("Token nach Entfernung des Präfix: " + token);


        try {
            authService.logout(token);
            return createResponse(true, "Abmeldung erfolgreich", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Fehler im Controller: " + e.getMessage()); // Log die Nachricht
            e.printStackTrace();
            return createResponse(false, "Abmeldung fehlgeschlagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
