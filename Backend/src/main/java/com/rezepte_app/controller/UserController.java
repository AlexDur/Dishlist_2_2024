package com.rezepte_app.controller;

import com.rezepte_app.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserController {

    private final com.rezepte_app.service.ActiveTagService activeTagService;

    public UserController(com.rezepte_app.service.ActiveTagService activeTagService) {
        this.activeTagService = activeTagService;
    }

    @PostMapping("/activeTags")
    public ResponseEntity<String> setActiveTags(@RequestBody Set<Tag> tags) {
        if (tags == null || tags.isEmpty()) {
            return ResponseEntity.badRequest().body("Fehler: Die Liste der Tags darf nicht leer sein.");
        }
        try {
            activeTagService.setActiveTags(tags); // Annahme, dass die Methode jetzt keinen userID benötigt
            return ResponseEntity.ok("Aktive Tags erfolgreich gesetzt.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Setzen der aktiven Tags: " + e.getMessage());
        }
    }
}
