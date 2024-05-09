// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.*;
import com.rezepte_app.model.Rezept;
import jakarta.validation.Valid;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/*Erlaubt Cross-Origin-Anfragen für diesen Controller. Nötig, weil das Frontend auf einem anderen Server oder Port gehostet wird als das Backend.*/
@CrossOrigin(origins = "*")

/*Gibt an, dass diese Klasse ein Controller mit Endpunkten ist, die JSON (oder XML Antworten) zurückgeben.*/
@RestController

/*Definiert den Basispfad für alle Methoden in diesem Controller*/
@RequestMapping("/api/rezepte")
public class RezepteController {

    /*Logger für Fehlersuche und Überwachung der Anwendung*/
    private static final Logger logger = LoggerFactory.getLogger(RezepteController.class);


    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<String> handleServiceException(ServiceException e) {
        // Log the exception and return an appropriate response
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }

    @Autowired
    private TagService tagService;

    /*Durch @Autowired wird eine Instanz von RezepteService injiziert. Das bedeutet,Spring kümmert sich automatisch
    um die Erstellung und Bereitstellung einer Instanz dieser Klasse, die die Geschäftslogik enthält*/
    @Autowired
    private RezepteService rezepteService; // Injizieren des RezepteService

    // Methode zum Hinzufügen eines Tags zu einem Rezept
    @PostMapping("/{rezeptId}/addTags")
    public ResponseEntity<String> addTagsToRezept(@PathVariable("rezeptId") int rezeptId, @RequestBody List<Tag> tags) {
        try {
            rezepteService.addTagsToRezept(rezeptId, tags);
            return ResponseEntity.ok("Tags erfolgreich zum Rezept hinzugefügt.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/tags")
    public ResponseEntity<List<Tag>> saveTags(@RequestBody List<Tag> tags) {
        try {
            List<Tag> savedTags = tagService.saveTags(tags);
            return ResponseEntity.ok(savedTags); // Rückgabe der gespeicherten Tags
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    /*Methode verarbeitet POST-Anfragen auf /api/rezepte/create. Sie nimmt ein Rezept-Objekt aus dem Request Body entgegen
    und verwendet rezepteService, um das Rezept in der Datenbank zu speichern. Bei Erfolg wird eine Antwort mit dem Status
    HttpStatus.CREATED und Details zum erstellten Rezept zurückgegeben*/
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRezept(@RequestBody @Valid Rezept rezept) {
        logger.info("POST-Anfrage erhalten für Rezepterstellung: {}", rezept);

        try {
            // Erstellt das Rezept direkt ohne manuelle Validierung der Tags
            Rezept createdRezept = rezepteService.createRezept(rezept);

            // Erstellt ein JSON-Objekt für die Antwort
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezept erfolgreich erstellt.");
            response.put("id", createdRezept.getId());

            logger.info("Antwort beim Erstellen des Rezepts: {}", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Fehler beim Erstellen des Rezepts", e);

            // Bei einem anderen Fehler ebenfalls ein JSON-Objekt für die Antwort erstellen
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Interner Serverfehler beim Erstellen des Rezepts");

            logger.error("Fehlerantwort beim Erstellen des Rezepts: {}", errorResponse);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /*Methode verarbeitet GET-Anfragen auf /api/rezepte/alleRezepte und holt über rezepteService alle Rezepte aus der Datenbank.*/
    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteService.fetchAlleRezepte();
    }

    @PutMapping("/tags/{tagId}")
    public ResponseEntity<Tag> updateTag(@PathVariable("tagId") int tagId, @RequestBody Tag updatedTag) {
        try {
            logger.info("Empfangene Tags: {}", updatedTag);

            Tag updated = rezepteService.updateTag(tagId, updatedTag.getLabel(), updatedTag.getSeverity());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    /*PUT-Anfrage Methode auf /api/rezepte/update/{id} aktualisiert ein bestehendes Rezept. Sie versucht, ein Rezept mit der spezifizierten ID zu aktualisieren.*/
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRezept(@PathVariable("id") int id, @Valid @RequestBody Rezept rezept) {
        try {
            // Hier loggen Sie das empfangene Rezept
            logger.info("Empfangenes Rezept: {}", rezept);

            if (rezept.getId() != id) {
                return ResponseEntity.badRequest().body("Die ID des Rezepts stimmt nicht mit der angegebenen ID überein.");
            }

            Optional<Rezept> updatedRezeptOptional = rezepteService.updateRezept(rezept);
            if (updatedRezeptOptional.isPresent()) {
                Rezept updatedRezept = updatedRezeptOptional.get();
                return ResponseEntity.ok(updatedRezept);
            } else {
                return ResponseEntity.notFound().build(); // Hier wird build() anstelle von body() verwendet
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Fehler beim Aktualisieren des Rezepts: " + e.getMessage());
        }
    }



    /*Für DELETE-Anfragen auf /api/rezepte/delete/{id} versucht diese Methode, ein Rezept mit der gegebenen ID zu löschen*/
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
