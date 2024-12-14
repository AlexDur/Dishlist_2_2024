package com.rezepte_app.S3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3ImageUploadService {

    private static final Logger logger = LoggerFactory.getLogger(S3ImageUploadService.class);


    private final S3Client s3Client;

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
    }



    /**
     * Methode zum Hochladen von Bildern in S3
     *
     * @param file
     * @param userId
     * @return
     */

    public String uploadImageToS3(MultipartFile file, String userId) {
        String fileName = "images/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            PutObjectResponse response = s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );

            logger.info("Datei erfolgreich hochgeladen zu S3: ETag = {}", response.eTag());
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, "eu-central-1", fileName);

        } catch (IOException e) {
            throw new RuntimeException("Fehler beim Hochladen der Datei zu S3: " + e.getMessage(), e);
        }
    }

}
