package com.rezepte_app.shared.imageUpload.decorators;

import com.rezepte_app.shared.imageUpload.model_basisklasse.Image;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class CompressedImageDecorator extends ImageDecorator {
    private final MultipartFile file;

    @Value("${LOCAL_DIR}")
    private String localDir;

    public CompressedImageDecorator(Image image,MultipartFile file) {
        super(image);  // Aufruf des Konstruktors der Oberklasse
        this.file = file;  // MultipartFile für den Upload speichern
    }

    @Override
    public void upload() throws IOException{
        
        try {
            // Hier die Logik zur Komprimierung des Bildes
            byte[] compressedImageBytes = compressImage(file); // Hypothetische Methode zur Komprimierung

            // Eindeutiger Dateiname für das komprimierte Bild
            String fileName = getFileName(); // Hier den Dateinamen verwenden
            File outputFile = new File(localDir, fileName);

            // Sicherstellen, dass das Verzeichnis existiert
            File directory = new File(localDir);
            if (!directory.exists()) {
                directory.mkdirs(); // Verzeichnis erstellen, wenn es nicht existiert
            }

            // Das komprimierte Bild lokal speichern
            try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                fos.write(compressedImageBytes);
            }

            System.out.println("Bild erfolgreich komprimiert und lokal gespeichert: " + outputFile.getAbsolutePath());

        } catch (IOException e) {
            System.out.println("Fehler bei der Komprimierung oder dem Speichern des Bildes: " + e.getMessage());
        }
    }

    // Hypothetische Methode zum Komprimieren des Bildes
    private byte[] compressImage(MultipartFile file) throws IOException {
        // Konvertiere MultipartFile in BufferedImage
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Erstelle einen ByteArrayOutputStream, um die komprimierten Bytes zu speichern
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Definiere die Komprimierungsstufe (0.0 - 1.0, wobei 1.0 die höchste Qualität ist)
        float quality = 0.7f; // Beispiel: 70% Qualität

        // Komprimiere das Bild und schreibe die komprimierten Bytes in den ByteArrayOutputStream
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
        ((ImageWriter) writer).setOutput(ios);

        // Setze die Komprimierungseinstellungen
        ImageWriteParam param = writer.getDefaultWriteParam();
        if (param.canWriteCompressed()) {
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(quality);
        }

        // Schreibe das Bild in den OutputStream
        writer.write(null, new IIOImage(originalImage, null, null), param);
        writer.dispose();

        // Gebe die komprimierten Bytes zurück
        return baos.toByteArray();
    }

}

