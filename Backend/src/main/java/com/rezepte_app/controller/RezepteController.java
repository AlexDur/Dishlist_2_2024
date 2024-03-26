// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/rezepte") // Basispfad für Ihre API-Endpunkte
public class RezepteController {

    private static final Logger logger = LoggerFactory.getLogger(RezepteController.class);


    @Autowired
    private RezepteService rezepteService; // Injizieren des RezepteService


    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRezept(@RequestBody Rezept rezept) {
        logger.info("POST-Anfrage erhalten für Rezepterstellung: {}", rezept);
        try {
            Rezept createdRezept = rezepteService.createRezept(rezept); // Verwenden des RezepteServices

            // Erstelle ein JSON-Objekt für die Antwort
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezept erfolgreich erstellt.");
            response.put("id", createdRezept.getId());

            logger.info("Antwort beim Erstellen des Rezepts: {}", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Fehler beim Erstellen des Rezepts", e);

            // Bei einem Fehler ebenfalls ein JSON-Objekt für die Antwort erstellen
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Fehler beim Erstellen des Rezepts: " + e.getMessage());

            logger.error("Fehlerantwort beim Erstellen des Rezepts: {}", errorResponse);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteService.fetchAlleRezepte();

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
    public ResponseEntity<String> deleteRezept(@PathVariable("id") int id) {
        logger.info("ID, die vom Frontend empfangen wurde: {}", id);
        boolean deleted = rezepteService.deleteRezept(id);
        if (deleted) {
            return new ResponseEntity<>("Rezept erfolgreich gelöscht", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Rezept mit der angegebenen ID wurde nicht gefunden", HttpStatus.NOT_FOUND);
        }
    }

}
