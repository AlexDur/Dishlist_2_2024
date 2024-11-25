package com.rezepte_app.service;

import jakarta.annotation.PostConstruct;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;

import software.amazon.awssdk.regions.Region;


import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.UUID;

@Getter
@Service
public class ImageUploadService {

    private static final Logger log = LoggerFactory.getLogger(ImageUploadService.class);

    @Value("${LOCAL_DIR}")
    private String localDir;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    private S3Client s3Client;

    @PostConstruct
    public void initializeS3Client() {
        s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create()) // Nutzt automatisch die IAM-Rolle
                .build();

        log.info("S3Client erfolgreich initialisiert mit Region: {}", region);
    }


    public String uploadImage(MultipartFile file, int width, int height) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Bild lesen und in RGB konvertieren (optional, falls nötig)
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        BufferedImage resizedImage = resizeImage(originalImage, width, height);

        // Skalierte Bilddaten in einem InputStream speichern
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", os);  // Speichern im JPEG-Format (oder anderen Formaten)
        InputStream inputStream = new ByteArrayInputStream(os.toByteArray());

        // Bild-Upload auf S3
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType("image/jpeg")  // oder file.getContentType(), falls das Originalformat gewünscht ist
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, os.size()));
            log.info("Bild erfolgreich zu S3 hochgeladen: {}", fileName);
        } catch (S3Exception e) {
            log.error("Fehler beim Hochladen des Bildes zu S3: {}", e.getMessage());
            throw new IOException("Fehler beim Hochladen des Bildes zu S3", e);
        } finally {
            inputStream.close();  // InputStream schließen
        }

        // S3-URL des hochgeladenen Bildes zurückgeben
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, fileName);
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();
        return resizedImage;
    }


}
