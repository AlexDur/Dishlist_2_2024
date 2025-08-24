/*
package com.rezepte_app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@Disabled
public class ImageUploadServiceTest {

    @Mock
    private S3Client s3Client;

    private ImageUploadService imageUploadService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        imageUploadService = new ImageUploadService();
        imageUploadService.setBucketName("bucket-bonn24");
        imageUploadService.setRegion("eu-central-1");

        // Mocking des S3-Clients setzen
        imageUploadService.setS3Client(s3Client);
    }

    @Test
    public void testUploadImage() throws IOException {
        // Vorbereitungen
        String originalFileName = "test.jpg";
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", originalFileName, "image/jpeg", createTestImageBytes(100, 100)
        );

        int targetWidth = 50;
        int targetHeight = 50;

        ArgumentCaptor<PutObjectRequest> requestCaptor = ArgumentCaptor.forClass(PutObjectRequest.class);
        ArgumentCaptor<RequestBody> bodyCaptor = ArgumentCaptor.forClass(RequestBody.class);

        // Test ausführen
        String uploadedUrl = imageUploadService.uploadImage(mockFile, targetWidth, targetHeight);

        // Überprüfungen
        verify(s3Client).putObject(requestCaptor.capture(), bodyCaptor.capture());

        PutObjectRequest capturedRequest = requestCaptor.getValue();
        assertEquals("test-bucket", capturedRequest.bucket());
        assertTrue(capturedRequest.key().endsWith(".jpg")); // UUID wird erzeugt, daher nur Endung prüfen

        // Sicherstellen, dass URL korrekt ist
        assertTrue(uploadedUrl.startsWith("https://test-bucket.s3.eu-central-1.amazonaws.com/"));

        // Überprüfen, ob das Bild korrekt resized wurde
        ByteArrayInputStream inputStream = new ByteArrayInputStream(bodyCaptor.getValue().contentStreamProvider().newStream().readAllBytes());
        BufferedImage uploadedImage = ImageIO.read(inputStream);
        assertEquals(targetWidth, uploadedImage.getWidth());
        assertEquals(targetHeight, uploadedImage.getHeight());
    }

    private byte[] createTestImageBytes(int width, int height) throws IOException {
        // Erstellt ein Testbild mit den angegebenen Maßen
        BufferedImage testImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageIO.write(testImage, "jpg", os);
        return os.toByteArray();
    }
}
*/
