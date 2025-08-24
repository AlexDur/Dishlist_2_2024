package com.rezepte_app.service.ImageServices;

import org.springframework.beans.factory.annotation.Autowired;


import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Exception;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.UUID;

@Getter
@Service
public class ImageUploadService {

    private static final Logger log = LoggerFactory.getLogger(ImageUploadService.class);
    private final S3Service s3Service;
    private final ImageProcessingService imageProcessingService;

    @Autowired
    public ImageUploadService(S3Service s3Service, ImageProcessingService imageProcessingService) {
        this.s3Service = s3Service;
        this.imageProcessingService = imageProcessingService;
    }

    public String uploadImage(MultipartFile file, int width, int height) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Resize des Bildes
        BufferedImage resizedImage = imageProcessingService.resizeImage(originalImage, width, height);
        try (ByteArrayInputStream inputStream = imageProcessingService.convertToInputStream(resizedImage, "jpg")) {
            long fileSize = inputStream.available();
            return s3Service.uploadFile(inputStream, fileName, fileSize, "image/jpeg");
        } catch (IOException | S3Exception e) {
            log.error("Fehler beim Bild-Upload: {}", e.getMessage());
            throw new RuntimeException("Fehler beim Bild-Upload", e);
        }
    }


}
