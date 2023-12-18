// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/rezepte") // Basispfad für Ihre API-Endpunkte
public class RezepteController {

    @Autowired
    private RezepteService rezepteService; // Injizieren des RezepteService


    @PostMapping("/create")
    public ResponseEntity<String> createRezept( @RequestBody Rezept rezept) {
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


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateRezept(@RequestBody Rezept rezept) {
        try {
            Optional<Rezept> updatedRezeptOptional = rezepteService.updateRezept(rezept); // Verwenden des RezepteServices
            if (updatedRezeptOptional.isPresent()) {
                Rezept updatedRezept = updatedRezeptOptional.get();
                return ResponseEntity.status(HttpStatus.OK).body("Rezept erfolgreich aktualisiert. ID: " + updatedRezept.getId());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rezept wurde nicht gefunden.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Aktualisieren des Rezepts: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRezept(@PathVariable int id) {
        try {
            boolean deleted = rezepteService.deleteRezept(id); // Verwenden des RezepteServices

            if (deleted) {
                return ResponseEntity.status(HttpStatus.OK).body("Rezept erfolgreich gelöscht. ID: " + id);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rezept wurde nicht gefunden.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Löschen des Rezepts: " + e.getMessage());
        }
    }

}
