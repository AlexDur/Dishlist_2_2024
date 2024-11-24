package com.rezepte_app.S3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

@Service
public class S3ImageUploadService {

    private static final Logger logger = LoggerFactory.getLogger(S3ImageUploadService.class);


    private final S3Client s3Client;
    private final S3Config s3Config;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;


    /**
     * Einbindung des S3Clients über Konstruktor
     * @param s3Client
     * @param s3Config
     * @return
     */
    public S3ImageUploadService(S3Client s3Client, S3Config s3Config) {
        this.s3Client = s3Client;
        this.s3Config = s3Config;
    }



    /**
     * Methode zum Hochladen von Bildern in S3
     * @param file
     * @return
     */

    public String uploadImageToS3(MultipartFile file) {
        String fileName = "images/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        try {
            // Erstelle das PutObjectRequest für das Bild
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            // Hochladen der Datei in S3
            PutObjectResponse response = s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            logger.info("Datei erfolgreich hochgeladen: ETag = {}", response.eTag());

            String bucketRegion = s3Config.getBucketRegion();
            String url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, bucketRegion, fileName);

            logger.info("Manuell generierte URL: {}", url);

            return url;

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Hochladen der Datei ins S3-Bucket: " + e.getMessage(), e);
        }
    }

}
