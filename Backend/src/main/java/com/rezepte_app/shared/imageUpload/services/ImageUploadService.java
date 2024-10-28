package com.rezepte_app.shared.imageUpload.services;

import com.rezepte_app.shared.imageUpload.model_basisklasse.Image;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Getter
@Service
public class ImageUploadService {

    private static final Logger log = LoggerFactory.getLogger(ImageUploadService.class);

    @Value("${LOCAL_DIR}")
    private String localDir;

   //Sorgt dafür, dass init()-Methode nach der Konstruktion der Bean aufgerufen wird
    @PostConstruct
    public void init() {
        // Überprüfung, ob das Verzeichnis existiert
        // File repräsentiert in Java Dateien oder Verzeichnisse
        File directory = new File(localDir);
        if (!directory.exists()) {
            // Fehlermeldung ausgeben oder eine Ausnahme werfen
            throw new IllegalStateException("Das Verzeichnis " + localDir + " existiert nicht.");
        }
    }

    @Autowired
    public ImageUploadService(@Value("${LOCAL_DIR}") String localDir) {
        this.localDir = localDir;
        log.info("Lokales Verzeichnis: {}", this.localDir);
        File directory = new File(localDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String uploadImage(MultipartFile file, int width, int height) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(localDir, fileName);

        // ...
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Bild im ursprünglichen Format speichern
        saveImageToFolder(originalImage, fileName);

        return path.toString();
    }


    /*private BufferedImage resizeImage(BufferedImage originalImage, int width, int height) {
        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, width, height, null);
        g.dispose();
        return resizedImage;
    }

    private byte[] compressImage(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
        writer.setOutput(ios);

        ImageWriteParam param = writer.getDefaultWriteParam();
        if (param.canWriteCompressed()) {
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(0.7f); // Beispiel: 70% Qualität
        }

        writer.write(null, new IIOImage(image, null, null), param);
        writer.dispose();

        return baos.toByteArray();
    }*/

    private String getFormatName(String fileName) {
        if (fileName != null) {
            int dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
                return fileName.substring(dotIndex + 1).toLowerCase();
            }
        }
        // Standardformat zurückgeben, falls kein Format gefunden wurde
        return "jpg";
    }

    private void saveImageToFolder(BufferedImage image, String fileName) throws IOException {
        File outputFile = new File(localDir, fileName);
        String formatName = getFormatName(fileName);
        ImageIO.write(image, formatName, outputFile);
        log.info("Bild erfolgreich gespeichert: {}", outputFile.getAbsolutePath());
    }



/*    public String saveImage(MultipartFile file) throws IOException {
        return uploadImage(file, 800, 600); // Standardwerte
    }*/
}
