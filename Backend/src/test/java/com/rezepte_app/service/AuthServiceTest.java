/*
package com.rezepte_app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    //Keine echte Impl verwendet, nur simuliert
    @Mock
    private CognitoIdentityProviderClient cognitoClient;

    @Value("${aws.cognito.userPoolClientId}")
    private String userPoolClientId;

    @Value("${aws.cognito.userPoolClientSecret}")
    private String userPoolClientSecret;

    @Value("${test.user.email}")
    private String testEmail;

    @Value("${test.user.password}") // Der Key aus deiner application-test.properties Datei
    private String testPassword;

    //Damit gemockte Abh. automatisch ins zu testende Objekt injiziert werden
    @Autowired
    private AuthService authService;



*/
/*    private final String email = "test@example.com";
    private final String password = "Password123!";
    private final String secretHash = "secretHash123";*//*



    //Initalisierung
    @BeforeEach
    void setUp() {
        // Manuelles Setzen des Werts von userPoolClientSecret für den Test
        this.userPoolClientSecret = "testSecret";
    }


    @Test
    void testRegisterUser() {
        String uniqueEmail = "test" + UUID.randomUUID() + "@example.com";

        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username(uniqueEmail)
                .password(testPassword)
                .clientId(userPoolClientId)
                .build();

        String clientSecret = "testSecret";
        // Erstellt Mock für den SignUpResponse
        SignUpResponse signUpResponse = SignUpResponse.builder()
                .userConfirmed(false)
                .build();

        // Mocking der Antwort des Cognito-Clients
        when(cognitoClient.signUp(any(SignUpRequest.class))).thenReturn(signUpResponse);

        SignUpResponse response = authService.registerUser(uniqueEmail, testPassword);

        // Verifikation der Ergebnisse
        assertNotNull(response, "Die Antwort sollte nicht null sein");
        assertFalse(response.userConfirmed(), "Der Benutzer sollte nicht bestätigt sein");

        verify(cognitoClient).signUp(any(SignUpRequest.class));
    }


    @Test
    void testCalculateSecretHashWithNullClientSecret() {

        String clientSecret = null;
        String email = "test@example.com";
        String username = "testuser";

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            authService.calculateSecretHash(clientSecret, email, username );
        });
    }

}
*/
