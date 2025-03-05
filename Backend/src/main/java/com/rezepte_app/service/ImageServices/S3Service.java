package com.rezepte_app.service.ImageServices;

import com.rezepte_app.S3.S3Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.InputStream;

@Service
public class S3Service {

    private static final Logger log = LoggerFactory.getLogger(S3Service.class);
    private final S3Client s3Client;
    private final S3Properties s3Properties;

    @Autowired
    public S3Service(S3Properties s3Properties) {
        this.s3Properties = s3Properties;
        this.s3Client = S3Client.builder()
                .region(Region.of(s3Properties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        log.info("S3Client erfolgreich initialisiert mit Region: {}", s3Properties.getRegion());

    }

    public String uploadFile(InputStream inputStream, String fileName, long fileSize, String contentType) throws S3Exception {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(s3Properties.getBucketName())
                .key(fileName)
                .contentType(contentType)
                .build();

        s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, fileSize));
        log.info("Datei erfolgreich zu S3 hochgeladen: {}", fileName);

        return String.format("https://%s.s3.%s.amazonaws.com/%s",
                s3Properties.getBucketName(), s3Properties.getRegion(), fileName);
    }
}

