
/*TODO: RezeptDTO einführen*/

// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.S3.S3ImageUploadService;
import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.service.JwtUtil;
import com.rezepte_app.service.TagService;
import com.rezepte_app.service.RezepteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.validation.ObjectError;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;


/*Erlaubt Cross-Origin-Anfragen für diesen Controller. Nötig, weil das Frontend auf einem anderen Server oder Port gehostet wird als das Backend.*/
@CrossOrigin(origins = "*")
/*Gibt an, dass diese Klasse ein Controller mit Endpunkten ist, die JSON (oder XML Antworten) zurückgeben.*/
@RestController
/*Definiert den Basispfad für alle Methoden in diesem Controller*/
@RequestMapping("/api/rezepte")
public class RezepteController {

    /*Logger für Fehlersuche und Überwachung der Anwendung*/
    private static final Logger logger = LoggerFactory.getLogger(RezepteController.class);
    private final TagService tagService;
    private final S3ImageUploadService s3ImageUploadService;
    private RezepteService rezepteService;
    private RezepteRepository rezepteRepository;
    private TagRepository tagRepository;
    private JwtUtil jwtUtil;

    /*Konstruktor-basiertes DI: MIt @Autowired wird e. Instanz von RezepteService injiziert --> Spring kümmert sich automatisch
    um die Erstellung und Bereitstellung e. Instanz dieser Klasse, die die Geschäftslogik enthält*/
    @Autowired
    public RezepteController(S3ImageUploadService s3ImageUploadService,
                             RezepteService rezepteService,
                             TagService tagService,
                             RezepteRepository rezepteRepository,
                             JwtUtil jwtUtil) {
        this.s3ImageUploadService = s3ImageUploadService;
        this.rezepteService = rezepteService;
        this.tagService = tagService;
        this.tagRepository = tagRepository;
        this.rezepteRepository = rezepteRepository;
        this.jwtUtil = jwtUtil;
        System.out.println("RezepteController: Service wurde erfolgreich injiziert!");
    }


/*    private String extractUserIdFromToken(String authorizationHeader) {
        String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;
        return jwtUtil.getUserIdFromToken(token);
    }*/


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
            return ResponseEntity.ok(savedTags);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

/*    @PostMapping("/import")
    public ResponseEntity<Void> importDefaultTags(@RequestBody List<Tag> tags) {
        for (Tag tag : tags) {
            if (!tagService.existsByLabel(tag.getLabel())) {
                tagService.addTag(tag); // Methode zum Hinzufügen eines Tags
            }
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }*/


    /*Controller generell, hier: Controller-Methode verarbeitet POST-Anfragen auf /api/rezepte/create. Ist für den Empfang und das Parsing
     der Daten aus dem Frontent zuständig. Übergibt die empfangenen Daten an den Serivce (wo eig.
     Geschäftslogik sitzt). Zudem wird die HTTP-Antwort erstellt und an FE gesendet (Das passiert hier im try-catch*/
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createRezept(
            @RequestPart(value = "rezeptDTO") RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            BindingResult result) {

        // Überprüfe auf Validierungsfehler
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }

        try {
            validateAndLogTags(rezeptDTO);
            String imageUrl = rezeptDTO.getBildUrl();

            if (imageUrl == null || imageUrl.isEmpty()) {
                if (image != null && !image.isEmpty()) {
                    imageUrl = s3ImageUploadService.uploadImageToS3(image, null);
                } else {
                    logger.warn("Kein Bild vorhanden. Rezept wird ohne Bild gespeichert.");
                }
            }

            // Rezept speichern (ohne Benutzer-ID)
            Rezept createdRezept = rezepteService.createRezept(rezeptDTO, null, image, imageUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezept erfolgreich erstellt.");
            response.put("id", createdRezept.getId());
            response.put("name", createdRezept.getName());
            response.put("bildUrl", createdRezept.getBildUrl());
            response.put("onlineAdresse", createdRezept.getOnlineAdresse());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Interner Serverfehler beim Erstellen des Rezepts.");
            errorResponse.put("details", "Es gab einen internen Fehler beim Verarbeiten des Rezepts.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }





    // Hilfsmethoden für createRezept
    private ResponseEntity<Map<String, Object>> handleValidationErrors(BindingResult result) {
        Map<String, Object> validationErrorResponse = new HashMap<>();
        validationErrorResponse.put("error", "Validierungsfehler im RezeptDTO.");
        validationErrorResponse.put("details", result.getAllErrors().stream()
                .map(ObjectError::getDefaultMessage).collect(Collectors.toList()));

        logger.warn("Validierungsfehler im RezeptDTO: {}", validationErrorResponse);
        return ResponseEntity.badRequest().body(validationErrorResponse);
    }

    private void validateAndLogTags(RezeptDTO rezeptDTO) {
        if (rezeptDTO.getTags() != null && !rezeptDTO.getTags().isEmpty()) {
            rezeptDTO.getTags().forEach(tag ->
                    System.out.println("Tag - Label: " + tag.getLabel() + ", Type: " + tag.getType() +
                            ", Selected: " + tag.isSelected() + ", Count: " + tag.getCount())
            );
        } else {
            System.out.println("Tags: null oder leer");
        }
    }




    /*PUT-Anfrage Methode auf /api/rezepte/update/{id} aktualisiert ein bestehendes Rezept. Sie versucht, ein Rezept mit der spezifizierten ID zu aktualisieren.*/
    //<?> =  ein Wildcard, ergo Body der Antwort kann ein Objekt von beliebigem Typ sein
    /*@PutMapping("/update/{id}")
    public ResponseEntity<?> updateRezept(
            @RequestHeader(value = "Authorization") String authorizationHeader,
            @PathVariable("id") long id,
            @Valid @RequestPart("rezeptDTO") RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {


        try {
            // JWT auslesen und User-ID extrahieren
            String userId = extractUserIdFromToken(authorizationHeader);

            // Rezept laden
            Optional<Rezept> originalRezeptOptional = rezepteRepository.findById(id);
            if (originalRezeptOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rezept nicht gefunden.");
            }

            if (rezeptDTO.getId() == null) {
                rezeptDTO.setId(Long.valueOf(String.valueOf(id)));
            }


            Rezept originalRezept = originalRezeptOptional.get();

            // Überprüfung der Berechtigung
            if (!userId.equals(originalRezept.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Keine Berechtigung, dieses Rezept zu ändern.");
            }

            // Rezept aktualisieren im Service
            Rezept updatedRezept = rezepteService.updateRezept(id, rezeptDTO, userId, image);

            return ResponseEntity.ok(updatedRezept);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("RController_Fehler beim Aktualisieren des Rezepts: " + e.getMessage());
        }
    }*/


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

    /*Methode verarbeitet GET-Anfragen auf /api/rezepte/alleRezepte und holt über rezepteService alle Rezepte aus der Datenbank.
      List-Api mit eingebauten Methoden
      Es dürfen nur Rezept-Objekte in die List eingefügt werden*/
    @GetMapping("/alleRezepte")
    public ResponseEntity<List<Rezept>> getAlleRezepte() {
        try {
            List<Rezept> alleRezepte = rezepteService.fetchAlleRezepte();
            return ResponseEntity.ok(Optional.ofNullable(alleRezepte).orElse(Collections.emptyList()));
        } catch (Exception e) {
            logger.error("Fehler beim Abrufen aller Rezepte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @GetMapping("/userRezepte")
    public ResponseEntity<List<Rezept>> getUserRezepte() {
        try {
            // Alle Rezepte abrufen (nicht mehr nur für einen User)
            List<Rezept> userRezepte = rezepteService.fetchAlleRezepte();

            // Falls keine Rezepte vorhanden sind, leere Liste zurückgeben
            return ResponseEntity.ok(Optional.ofNullable(userRezepte).orElse(Collections.emptyList()));

        } catch (Exception e) {
            logger.error("Fehler beim Abrufen der Rezepte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @GetMapping("/bilder/{bildname:.+}")
    public ResponseEntity<String> getBild(@PathVariable("bildname") String bildname) {
        String bucketName = "bonn-nov24";
        S3Client s3Client = S3Client.create();

        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(bildname)
                    .build());
            String s3Url = "https://" + bucketName + ".s3.eu-central-1.amazonaws.com/" + bildname;
            return ResponseEntity.ok(s3Url);
        } catch (NoSuchKeyException e) {
            return ResponseEntity.notFound().build();
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
