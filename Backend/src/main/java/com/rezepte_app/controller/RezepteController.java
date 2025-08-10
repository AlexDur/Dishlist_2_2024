

// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.service.JwtUtil;
import com.rezepte_app.service.RezepteService;
import com.rezepte_app.service.TagService;
import com.rezepte_app.S3.S3ImageUploadService;
import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
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
            @RequestPart(value = "rezeptDTO") @Valid RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            BindingResult result,
            @AuthenticationPrincipal Jwt jwt
    ) {
        if (jwt == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Benutzer nicht authentifiziert.");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        String userId = jwt.getSubject();

        if (userId == null || userId.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Benutzer-ID im Token fehlt.");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        System.out.println("Authentifizierter Benutzer: " + userId);

        // Überprüfe auf Validierungsfehler
        if (result.hasErrors()) {
            return handleValidationErrors(result);
        }

        try {
            Rezept neuesRezept = rezepteService.createRezept(rezeptDTO, userId, image, null);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Rezept erfolgreich erstellt");
            response.put("rezeptId", neuesRezept.getId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Interner Serverfehler beim Erstellen des Rezepts.");
            errorResponse.put("details", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Fehler beim Hochladen des Bildes.");
            errorResponse.put("details", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<List<Rezept>> getAlleRezepte(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            List<Rezept> alleRezepte = rezepteService.fetchAlleRezepte(token);
            return ResponseEntity.ok(Optional.ofNullable(alleRezepte).orElse(Collections.emptyList()));
        } catch (Exception e) {
            logger.error("Fehler beim Abrufen aller Rezepte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/userRezepte")
    public ResponseEntity<List<Rezept>> getUserRezepte(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            List<Rezept> userRezepte = rezepteService.fetchAlleRezepte(token);

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
