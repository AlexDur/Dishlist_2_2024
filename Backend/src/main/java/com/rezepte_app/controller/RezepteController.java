// RezepteController.java
package com.rezepte_app.controller;

import com.rezepte_app.*;
import com.rezepte_app.S3.S3ImageUploadService;
import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.service.JwtUtil;
import com.rezepte_app.service.TagService;
import com.rezepte_app.service.RezepteService;
import io.jsonwebtoken.Claims;
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
import java.nio.file.AccessDeniedException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PublicKey;
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
    @Autowired
    private RezepteRepository rezepteRepository;


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
    public RezepteController(S3ImageUploadService s3ImageUploadService, RezepteService rezepteService, TagService tagService, JwtUtil jwtUtil) {
        this.s3ImageUploadService = s3ImageUploadService;
        this.jwtUtil = jwtUtil;
        System.out.println("RezepteController: Service wurde erfolgreich injiziert!");
        this.rezepteService = rezepteService;
        this.tagService = tagService;
    }


   /* private static final String BILDER_VERZEICHNIS = "C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/Fullstack_RezepteApp_2/Rezeptbilder";
*/
    @Autowired
    private JwtUtil jwtUtil;

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
            @RequestHeader(value = "Authorization") String authorizationHeader,
            @RequestPart("rezeptDTO") @Valid RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image,
            BindingResult result) {

        System.out.println("Empfangene Daten (Create): " + rezeptDTO);

        // Überprüfung auf Validierungsfehler im RezeptDTO
        if (result.hasErrors()) {
            Map<String, Object> validationErrorResponse = new HashMap<>();
            validationErrorResponse.put("error", "Validierungsfehler im RezeptDTO.");
            validationErrorResponse.put("details", result.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage).collect(Collectors.toList()));

            logger.warn("Validierungsfehler im RezeptDTO: {}", validationErrorResponse);
            return ResponseEntity.badRequest().body(validationErrorResponse);
        }


        try { // JWT-Token aus dem Header extrahieren
            String token = authorizationHeader.startsWith("Bearer ") ?
                    authorizationHeader.substring(7) :
                    authorizationHeader;

            // Extrahiere die User-ID aus dem Token
            String userId = jwtUtil.getUserIdFromToken(token);


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
                String imageUrl = s3ImageUploadService.uploadImageToS3(image, userId);
                System.out.println("Bild hochgeladen. URL: " + imageUrl);
            } else {
                System.out.println("Kein Bild übergeben.");
            }

            // Aufruf des Services zum Speichern des Rezepts
            Rezept createdRezept = rezepteService.createRezept(rezeptDTO, userId, image);

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




    /*PUT-Anfrage Methode auf /api/rezepte/update/{id} aktualisiert ein bestehendes Rezept. Sie versucht, ein Rezept mit der spezifizierten ID zu aktualisieren.*/
    //<?> =  ein Wildcard, ergo Body der Antwort kann ein Objekt von beliebigem Typ sein
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRezept(
            @RequestHeader(value = "Authorization") String authorizationHeader,
            @PathVariable("id") long  id,
            @Valid @RequestPart("rezeptDTO") RezeptDTO rezeptDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        System.out.println("Empfangene ID im Pfad: " + id);
        System.out.println("Vergleiche ID aus Pfad und RezeptDTO: " + id + " vs. " + rezeptDTO.getId());
        System.out.println("Authorization Header: " + authorizationHeader);
        System.out.println("Empfangene Daten (Update): " + rezeptDTO);


        try {
            // JWT auslesen und User-ID extrahieren
            String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;
            String userId = jwtUtil.getUserIdFromToken(token);

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
    public List<Rezept> getAlleRezepte(String userId) {
        return rezepteService.fetchAlleRezepte(userId);
    }


    @GetMapping("/userRezepte")
    public ResponseEntity<List<Rezept>> getUserRezepte(@RequestHeader(value = "Authorization") String authorizationHeader) {
        try {
            // JWT-Token extrahieren und sicherstellen, dass es das richtige Format hat
            String token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;

            // Überprüfe, ob der Token leer oder ungültig ist
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Ungültiger Token
            }

            String userId = jwtUtil.getUserIdFromToken(token);  // Benutzer-ID aus dem Token extrahieren

            // Falls keine gültige Benutzer-ID extrahiert werden kann
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);  // Token ist ungültig
            }

            // Rezepte des Nutzers abrufen
            List<Rezept> userRezepte = rezepteService.fetchAlleRezepte(userId);

            // Wenn keine Rezepte gefunden wurden, gebe eine leere Liste zurück
            if (userRezepte == null || userRezepte.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());  // Leere Liste zurückgeben
            }

            return ResponseEntity.ok(userRezepte);  // Rezepte zurückgeben
        } catch (Exception e) {
            logger.error("Fehler beim Abrufen der Nutzerrezepte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // Fehlerhafte Anfrage
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
