package com.rezepte_app.shared.imageUpload.services;

import com.rezepte_app.shared.imageUpload.decorators.CompressedImageDecorator;
import com.rezepte_app.shared.imageUpload.decorators.ResizedImageDecorator;
import com.rezepte_app.shared.imageUpload.model_basisklasse.Image;

import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Getter
@Service // Annotation, um die Klasse als Spring-Service zu kennzeichnen
public class ImageUploadService {


    private static final Logger log = LoggerFactory.getLogger(ImageUploadService.class);

    @Value("${LOCAL_DIR}")
    private String localDir;

    @Autowired
    // Konstruktor mit @Value zur Injizierung der Umgebungsvariablen
    public ImageUploadService(@Value("${LOCAL_DIR}") String localDir) {
        this.localDir = localDir; // Setze die lokale Verzeichniskonstante
        log.info("Lokales Verzeichnis: {}", this.localDir);
        // Sicherstellen, dass das lokale Verzeichnis existiert
        File directory = new File(localDir);
        if (!directory.exists()) {
            System.out.println("Verzeichnis nicht gefunden: " + localDir);
            directory.mkdirs(); // Verzeichnis erstellen, falls nicht vorhanden
        }
    }

    public String uploadImage(MultipartFile file, int width, int height) throws IOException {
        // Eindeutiger Dateiname für das Bild
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        String uploadDir = localDir;

        Path path = Paths.get(uploadDir, fileName);

        // Erstelle ein Image-Objekt, um es den Decorators zu übergeben
        Image image = new Image(file.getOriginalFilename()); // Beispiel: Erstellen eines Image-Objekts

        // AKtivierung des Dekorator zur Größenänderung
        ResizedImageDecorator resizedImageDecorator = new ResizedImageDecorator(image, width, height);

        // upload in Decorator eig. kein treffender Name mehr, weil die Methode etwas anderes tut
        resizedImageDecorator.upload();

        // Aktivierung des Decorators zur Komprimierung des Bildes
        CompressedImageDecorator compressedImageDecorator = new CompressedImageDecorator(image, file);

        // Auch hier beschreibt upload() das Geschechen nur teilweise. Allerdings erfolgt der finale Upload dann doch hier.
        compressedImageDecorator.upload(); // Hier sollte die Logik zur Komprimierung und zum Upload enthalten sein


        System.out.println("Erstellter Dateiname: " + fileName);

        return path.toString();
    }

    public String saveImage(MultipartFile file) throws IOException {
        // Standardwerte für Breite und Höhe festlegen oder von außen übergeben lassen
        int defaultWidth = 800;  // Beispiel für Standardbreite
        int defaultHeight = 600; // Beispiel für Standardhöhe

        // Aufruf der `uploadImage` Methode mit den Standardwerten
        return uploadImage(file, defaultWidth, defaultHeight);
    }

}




