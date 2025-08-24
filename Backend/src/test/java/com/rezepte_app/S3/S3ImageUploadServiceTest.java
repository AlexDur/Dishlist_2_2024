/*
package com.rezepte_app.S3;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

//Mockito, um die S3-Verbindungen zu simulieren

@SpringBootTest
@Disabled("Die gesamte Testklasse ist vorübergehend deaktiviert")
public class S3ImageUploadServiceTest {

    @Mock
    private S3Client s3Client;  // Mocked S3Client

    @Mock
    private S3Config s3Config;  // Mocked S3Config

    @InjectMocks
    private S3ImageUploadService s3ImageUploadService;  // The service to test

    @Value("${aws.s3.bucket-name}")
    private String bucketName = "bucket-bonn24";  // Set bucket name for tests

    @BeforeEach
    public void setUp() {
        // Initializes mocks
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testUploadImageToS3() throws IOException {
        // Arrange
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("test-image.jpg");
        when(mockFile.getInputStream()).thenReturn(new ByteArrayInputStream("test content".getBytes()));
        when(mockFile.getSize()).thenReturn(14L);

        // Mock the S3Config
        when(s3Config.getBucketRegion()).thenReturn("eu-central-1");

        // Mock the PutObjectResponse from S3
        PutObjectResponse mockResponse = mock(PutObjectResponse.class);
        when(mockResponse.eTag()).thenReturn("mocked-etag");

        // Mock the S3Client behavior
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(mockResponse);
        // Act
        String url = s3ImageUploadService.uploadImageToS3(mockFile);

        // Assert
        assertNotNull(url);
        assertTrue(url.startsWith("https://"));
        assertTrue(url.contains(bucketName));
        assertTrue(url.contains("eu-central-1"));
        verify(s3Client, times(1)).putObject((PutObjectRequest) any(PutObjectRequest.class), (RequestBody) any());
    }

    @Test
    public void testUploadImageToS3_WithIOException() throws IOException {
        // Arrange
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("test-image.jpg");
        when(mockFile.getInputStream()).thenThrow(new IOException("Test IOException"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            s3ImageUploadService.uploadImageToS3(mockFile);
        });

        assertEquals("Fehler beim Hochladen der Datei ins S3-Bucket: Test IOException", exception.getMessage());
    }
}
*/
