package com.rezepte_app.controller;

import com.rezepte_app.service.SubscriptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Konstruktor-Injektion
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    //Aktuelle Startzeitpunkt erzeugt, berechnetes Enddatum zurück
    @PostMapping("/startTrial")
    public LocalDateTime startTrial(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");  // userId aus JSON-Body extrahieren
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID darf nicht leer sein");
        }

        LocalDateTime startDate = LocalDateTime.now();
        subscriptionService.saveTrialStartDate(userId, startDate);
        return subscriptionService.calculateTrialEndDate(startDate);
    }

    @GetMapping("/trialStartDate")
    public LocalDateTime getTrialStartDate(@RequestParam String userId) {
        return subscriptionService.getTrialStartDate(userId);
    }


    // Abruf Startzeitpunkt e. Trials, Prüfung und Antwort an FE
    @GetMapping("/trialStatus")
    public ResponseEntity<Map<String, Object>> getTrialStatus(@RequestParam String userId) {
        LocalDateTime trialStart = subscriptionService.getTrialStartDate(userId);
        if (trialStart == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        boolean trialExpired = subscriptionService.isTrialExpired(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("startDate", trialStart.toLocalDate().toString());
        response.put("trialExpired", trialExpired);

        return ResponseEntity.ok(response);
    }
}

