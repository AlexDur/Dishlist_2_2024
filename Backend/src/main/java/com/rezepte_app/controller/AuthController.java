package com.rezepte_app.controller;

import com.rezepte_app.dto.LoginRequest;
import com.rezepte_app.dto.NutzerRegistrierungDto;
import com.rezepte_app.dto.VerfikationCodeDto;
import com.rezepte_app.service.AuthService;
import org.jetbrains.annotations.NotNull;
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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody NutzerRegistrierungDto registrierungDto) {
        try {
            authService.registerUser(
                    registrierungDto.getEmail(),
                    registrierungDto.getPassword()

            );
            return ResponseEntity.ok("Registrierung erfolgreich");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registrierung fehlgeschlagen: " + e.getMessage());
        }
    }

    //HashMap um strukturierte Antwort mit mehreren Feldern im BE zu erzeugen
    @PostMapping("/verify-code")
    public  ResponseEntity<Map<String, Object>>  verifyCode(@RequestBody VerfikationCodeDto verifikationCodeDto) {
        Map<String, Object> response = new HashMap<>();
        System.out.println("Empfangener JSON-Body: E-Mail: " + verifikationCodeDto.getEmail() + ", Code: " + verifikationCodeDto.getVerifikationCode());

        String email = verifikationCodeDto.getEmail();
        String verifikationCode = verifikationCodeDto.getVerifikationCode();

        try {
            // Der Code wird im Service überprüft, rechte Seite muss "true" zurückgeben, damit isVerified gilt
            boolean isVerified = authService.verifyCode(email, verifikationCode);
            if (isVerified) {
                response.put("success", true);
                response.put("message", "Verifizierung erfolgreich");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Verifizierung fehlgeschlagen: Ungültiger Code");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Fehler bei der Verifizierung: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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

            response.put("success", true);
            response.put("message", "Anmeldung erfolgreich");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Anmeldung fehlgeschlagen: " + (e.getMessage() != null ? e.getMessage() : "Unbekannter Fehler"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String token)  {
        Map<String, Object> response = new HashMap<>();
        try {
            authService.logout(token);
            response.put("success", true);
            response.put("message", "Abmeldung erfolgreich");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Abmeldung fehlgeschlagen: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


/*    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendverifikationCode(@RequestBody String email) {
        try {
            authService.resendverifikationCode(email);
            return ResponseEntity.ok("Verifizierungscode wurde erneut gesendet.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehler beim Senden des Verifizierungscodes: " + e.getMessage());
        }
    }*/

}