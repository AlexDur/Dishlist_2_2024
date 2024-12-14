package com.rezepte_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final CognitoIdentityProviderClient cognitoClient;
    private final String userPoolClientId;
    private final String userPoolClientSecret;

    @Autowired
    public AuthService(CognitoIdentityProviderClient cognitoClient,
                       @Value("${aws.cognito.userPoolClientId}") String userPoolClientId,
                       @Value("${aws.cognito.userPoolClientSecret}") String userPoolClientSecret) {
        this.cognitoClient = cognitoClient;
        this.userPoolClientId = userPoolClientId;
        this.userPoolClientSecret = userPoolClientSecret;
    }

    public SignUpResponse registerUser(String email, String password) {
        String secretHash = calculateSecretHash(this.userPoolClientSecret, email, this.userPoolClientId);
        return registerUserWithSecretHash(email, password, secretHash);
    }

    public SignUpResponse registerUserWithSecretHash(String email, String password, String secretHash) {
        try {
            Map<String, String> userAttributes = new HashMap<>();
            userAttributes.put("email", email);

            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(userPoolClientId)
                    .username(email)
                    .password(password)
                    .userAttributes(
                            software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType.builder()
                                    .name("email")
                                    .value(email)
                                    .build()
                    )
                    .secretHash(secretHash)
                    .build();

            return cognitoClient.signUp(signUpRequest);
        } catch (CognitoIdentityProviderException e) {
            // Handle specific Cognito exceptions
            throw new RuntimeException("Error during user registration: " + e.getMessage(), e);
        }
    }

    public boolean verifyCode(String email, String verifikationCode) {
        System.out.println("Verifizierung gestartet: E-Mail: " + email + ", Code: " + verifikationCode);

        try {

            if (verifikationCode == null || verifikationCode.trim().isEmpty()) {
                System.err.println("Bestätigungscode ist null oder leer.");
                return false;
            }

            String secretHash = calculateSecretHash(this.userPoolClientSecret, email, this.userPoolClientId);

            ConfirmSignUpRequest confirmSignUpRequest = ConfirmSignUpRequest.builder()
                    .clientId(userPoolClientId)
                    .username(email)
                    .confirmationCode(verifikationCode)
                    .secretHash(secretHash)
                    .build();

            cognitoClient.confirmSignUp(confirmSignUpRequest);
            return true;
        } catch (CognitoIdentityProviderException e) {
            // Log the error and return false for invalid or expired codes
            System.err.println("Error verifying code: " + e.getMessage());
            System.err.println("Cognito Error Code: " + e.awsErrorDetails().errorCode());
            System.err.println("Cognito Error Message: " + e.awsErrorDetails().errorMessage());
            return false;
        }
    }


    public String authenticateUser(String email, String password) {
        if (email == null || password == null ) {
            throw new IllegalArgumentException("E-Mail, Passwort oder Client Secret dürfen nicht null sein.");
        }

        String secretHash = calculateSecretHash(this.userPoolClientSecret, email, this.userPoolClientId);

        try {
            // Erstellung der Authentifizierungs-Anfrage für Cognito unter Verwendung des Builders
            InitiateAuthRequest authRequest = InitiateAuthRequest.builder()
                    .clientId(userPoolClientId)   // User Pool Client ID
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH)  // Authentifizierungsflow
                    .authParameters(
                            Map.of(
                                    "USERNAME", email,
                                    "PASSWORD", password,
                                    "SECRET_HASH", secretHash

                            )
                    ) // Authentifizierungsparameter
                    .build();

            // Authentifizierung an AWS Cognito
            InitiateAuthResponse authResponse = cognitoClient.initiateAuth(authRequest);


            // Das Access-Token wird zurückgegeben
            return authResponse.authenticationResult().accessToken();

        } catch (Exception e) {
            e.printStackTrace();
            // Fehlerbehandlung (falls das Authentifizierungsverfahren fehlschlägt)
            System.err.println("Fehler bei der Authentifizierung: " + e.getMessage());
            throw new RuntimeException("Fehler bei der Authentifizierung: " + e);
        }
    }


    public void logout(String token) {
        try {
            GlobalSignOutRequest signOutRequest = GlobalSignOutRequest.builder()
                    .accessToken(token)
                    .build();
            cognitoClient.globalSignOut(signOutRequest);
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Abmelden des Benutzers: " + e.getMessage(), e);
        }
    }


    /**
     * Berechnet den SECRET_HASH für Cognito.
     * @param clientSecret Das Client-Secret
     * @param clientId Die App-Client-ID
     * @return Der berechnete SECRET_HASH
     */
    public String calculateSecretHash(String clientSecret,String email, String clientId) {
        try {
            String message = email + clientId;
            SecretKeySpec signingKey = new SecretKeySpec(clientSecret.getBytes("UTF-8"), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(message.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Berechnen des SECRET_HASH", e);
        }
    }


}