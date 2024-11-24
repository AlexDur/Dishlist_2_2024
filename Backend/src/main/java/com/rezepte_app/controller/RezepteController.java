// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.*;
import com.rezepte_app.S3.S3ImageUploadService;
import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.service.TagService;
import com.rezepte_app.service.RezepteService;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.validation.ObjectError;


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

    private final TagService tagService;
    private final S3ImageUploadService s3ImageUploadService;
    /*Durch @Autowired wird eine Instanz von RezepteService injiziert. Das bedeutet,Spring kümmert sich automatisch
    um die Erstellung und Bereitstellung einer Instanz dieser Klasse, die die Geschäftslogik enthält*/
    private RezepteService rezepteService; // Injizieren des RezepteService

    @Autowired
    public RezepteController(S3ImageUploadService s3ImageUploadService, RezepteService rezepteService, TagService tagService) {
        this.s3ImageUploadService = s3ImageUploadService;
        System.out.println("RezepteController: Service wurde erfolgreich injiziert!");
        this.rezepteService = rezepteService;
        this.tagService = tagService;
    }


    private static final String BILDER_VERZEICHNIS = "C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/Fullstack_RezepteApp_2/Rezeptbilder";


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


    /*Controller generell, hier: Controller-Methode verarbeitet POST-Anfragen auf /api/rezepte/create. Ist für den Empfang und das Parsing
     der Daten aus dem Frontent zuständig. Übergibt die empfangenen Daten an den Serivce (wo eig.
     Geschäftslogik sitzt). Zudem wird die HTTP-Antwort erstellt und an FE gesendet (Das passiert hier im try-catch*/
    @PostMapping(value = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Map<String, Object>> createRezept(
            @RequestPart("rezeptDTO") @Valid RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            BindingResult result) {

        // Überprüfung auf Validierungsfehler im RezeptDTO
        if (result.hasErrors()) {
            Map<String, Object> validationErrorResponse = new HashMap<>();
            validationErrorResponse.put("error", "Validierungsfehler im RezeptDTO.");
            validationErrorResponse.put("details", result.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage).collect(Collectors.toList()));

            logger.warn("Validierungsfehler im RezeptDTO: {}", validationErrorResponse);
            return ResponseEntity.badRequest().body(validationErrorResponse);
        }

        try {
            // Rezeptinformationen und Tags ausgeben
            System.out.println("Empfangenes Rezept: Name=" + rezeptDTO.getName() +
                    ", OnlineAdresse=" + rezeptDTO.getOnlineAdresse());

            if (rezeptDTO.getTags() != null) {
                rezeptDTO.getTags().forEach(tag ->
                        System.out.println("Tag - Label: " + tag.getLabel() + ", Type: " + tag.getType() +
                                ", Selected: " + tag.isSelected() + ", Count: " + tag.getCount())
                );
            } else {
                System.out.println("Tags: null oder leer");
            }

            // Bildinformationen ausgeben
            if (image != null && !image.isEmpty()) {
                System.out.println("Empfangenes Bild: " + image.getOriginalFilename());
                // Bild hochladen und die URL zurückgeben
                String imageUrl = s3ImageUploadService.uploadImageToS3(image);
                System.out.println("Bild hochgeladen. URL: " + imageUrl);
            } else {
                System.out.println("Kein Bild übergeben.");
            }

            // Aufruf des Services zum Speichern des Rezepts
            Rezept createdRezept = rezepteService.createRezept(rezeptDTO, image);

            // Erfolgsantwort erstellen
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezept erfolgreich erstellt.");
            response.put("id", createdRezept.getId());
            logger.info("Antwort beim Erstellen des Rezepts: {}", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            // Fehlerhandling mit detaillierter Fehlerantwort
            logger.error("Fehler beim Erstellen des Rezepts", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Interner Serverfehler beim Erstellen des Rezepts.");
            errorResponse.put("details", e.getMessage());

            logger.error("Fehlerantwort beim Erstellen des Rezepts: {}", errorResponse);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }



    /*Methode verarbeitet GET-Anfragen auf /api/rezepte/alleRezepte und holt über rezepteService alle Rezepte aus der Datenbank.
      List-Api mit eingebauten Methoden
      Es dürfen nur Rezept-Objekte in die List eingefügt werden*/
    @GetMapping("/alleRezepte")
    public List<Rezept> getAlleRezepte() {
        return rezepteService.fetchAlleRezepte();
    }

    @GetMapping("/bilder/{bildname:.+}")
    public ResponseEntity<UrlResource> getBild(@PathVariable("bildname") String bildname) {
        try {
            // Kodierung des Bildnamens für die URL ist nicht notwendig, da der Name bereits im richtigen Format vorliegt
            // String encodedFileName = URLEncoder.encode(bildname, StandardCharsets.UTF_8.toString());

            // Basisverzeichnis und Bildpfad erstellen
            Path bildPfad = Paths.get("C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/Fullstack_RezepteApp_2/Rezeptbilder")
                    .resolve(bildname); // Verwendung des bildname, ohne ihn erneut zu kodieren

            System.out.println("Vollständiger Bildpfad: " + bildPfad.toAbsolutePath().toString());

            // Erstelle eine UrlResource und überprüfe Existenz und Lesbarkeit
            UrlResource resource = new UrlResource(bildPfad.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                System.out.println("Ressource nicht vorhanden: " + resource);
                return ResponseEntity.notFound().build();
            }

            // Bestimme den Content-Type basierend auf der Dateiendung
            MediaType mediaType;
            if (bildname.toLowerCase().endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (bildname.toLowerCase().endsWith(".jpg") || bildname.toLowerCase().endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else {
                System.out.println("Unbekanntes Bildformat für: " + bildname);
                mediaType = MediaType.APPLICATION_OCTET_STREAM; // Generischer Content-Type
            }

            // Erfolgreiche Rückgabe mit passendem Content-Type
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);
        } catch (MalformedURLException e) {
            System.out.println("Fehler beim Erstellen der URL für: " + bildname);
            return ResponseEntity.badRequest().build(); // 400 bei fehlerhaften Anfragen
        } catch (Exception e) {
            System.out.println("Allgemeiner Fehler für: " + bildname);
            System.out.println("Fehlermeldung: " + e.getMessage()); // Gibt die Fehlermeldung aus
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 bei unerwarteten Fehlern
        }
    }



    @PutMapping("/tags/{tagId}")
    public ResponseEntity<Tag> updateTag(@PathVariable("tagId") int tagId, @RequestBody Tag updatedTag) {
        try {
            logger.info("Empfangene Tags: {}", updatedTag);

            Tag updated = rezepteService.updateTag(tagId, updatedTag.getLabel());
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
