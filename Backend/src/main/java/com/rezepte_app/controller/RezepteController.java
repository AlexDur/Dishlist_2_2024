// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteService; // Fügen Sie Ihren RezepteService hinzu
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rezepte") // Basispfad für Ihre API-Endpunkte
public class RezepteController {

    @Autowired
    private RezepteService rezepteService; // Injizieren des RezepteService


    @PostMapping("/create")
    public ResponseEntity<String> createRezept(@RequestBody Rezept rezept) {
        try {
            Rezept createdRezept = rezepteService.createRezept(rezept); // Verwenden des RezepteServices
            return ResponseEntity.status(HttpStatus.CREATED).body("Rezept erfolgreich erstellt. ID: " + createdRezept.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Erstellen des Rezepts: " + e.getMessage());
        }
    }

    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteService.fetchAlleRezepte(); // Verwenden des RezepteServices
    }


    @PutMapping("/update")
    public ResponseEntity<String> updateRezept(@RequestBody Rezept rezept) {
        try {
            Rezept updatedRezept = rezepteService.updateRezept(rezept); // Verwenden des RezepteServices
            if (updatedRezept != null) {
                return ResponseEntity.status(HttpStatus.OK).body("Rezept erfolgreich aktualisiert. ID: " + updatedRezept.getId());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rezept wurde nicht gefunden.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Aktualisieren des Rezepts: " + e.getMessage());
        }
    }

}
