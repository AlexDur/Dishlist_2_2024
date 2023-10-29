// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RezepteController {

    @Autowired
    private RezepteRepository rezepteRepository;

    @PostMapping("/rezepte")
    public ResponseEntity<String> createRezept(@RequestBody Rezept rezept) {
        try {
            rezepteRepository.save(rezept);
            return ResponseEntity.status(HttpStatus.CREATED).body("Rezept erfolgreich erstellt.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fehler beim Erstellen des Rezepts.");
        }
    }

    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteRepository.findAll();
    }
}
