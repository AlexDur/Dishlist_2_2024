// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteRepository;
import com.rezepte_app.RezepteService;
import com.rezepte_app.Tag;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

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

    /*Durch @Autowired wird eine Instanz von RezepteService injiziert. Das bedeutet,Spring kümmert sich automatisch
    um die Erstellung und Bereitstellung einer Instanz dieser Klasse, die die Geschäftslogik enthält*/
    @Autowired
    private RezepteService rezepteService; // Injizieren des RezepteService

    // Methode zum Hinzufügen eines Tags zu einem Rezept
    @PostMapping("/{rezeptId}/addTag")
    public ResponseEntity<String> addTagToRezept(@PathVariable("rezeptId") int rezeptId, @RequestBody Tag tag) {
        try {
            rezepteService.addTagToRezept(rezeptId, tag);
            return ResponseEntity.ok("Tag erfolgreich zum Rezept hinzugefügt.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /*Methode verarbeitet POST-Anfragen auf /api/rezepte/create. Sie nimmt ein Rezept-Objekt aus dem Request Body entgegen
    und verwendet rezepteService, um das Rezept in der Datenbank zu speichern. Bei Erfolg wird eine Antwort mit dem Status
    HttpStatus.CREATED und Details zum erstellten Rezept zurückgegeben*/
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRezept(@RequestBody Rezept rezept) {
        logger.info("POST-Anfrage erhalten für Rezepterstellung: {}", rezept);

        // Stelle sicher, dass die Tags als Set<Tag> gespeichert werden
        Set<Tag> tags = new HashSet<>(rezept.getTags()); // Konvertiere die Liste von Tags in ein Set
        rezept.setTags(tags);

        try {
            Rezept createdRezept = rezepteService.createRezept(rezept);

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


    /*Methode verarbeitet GET-Anfragen auf /api/rezepte/alleRezepte und holt über rezepteService alle Rezepte aus der Datenbank.*/
    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteService.fetchAlleRezepte();

    }

    /*PUT-Anfrage Methode auf /api/rezepte/update/{id} aktualisiert ein bestehendes Rezept. Sie versucht, ein Rezept mit der spezifizierten ID zu aktualisieren.*/
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
