package com.rezepte_app.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

//Zur Interaktion mit AWS Cognito für die Benutzerregistrierung, Authentifizierung und Verifizierung von E-Mail-Codes.

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);


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
            SignUpRequest signUpRequest = buildSignUpRequest(email, password, secretHash);
            return cognitoClient.signUp(signUpRequest);
        } catch (CognitoIdentityProviderException e) {
            logger.error("Error during user registration", e);
            throw new RuntimeException("Error during user registration: " + e.getMessage(), e);
        }
    }

    public boolean verifyCode(String email, String verifikationCode) {
        if (verifikationCode == null || verifikationCode.trim().isEmpty()) {
            System.err.println("Bestätigungscode ist null oder leer.");
            return false;
        }

        try {
            String secretHash = calculateSecretHash(this.userPoolClientSecret, email, this.userPoolClientId);
            ConfirmSignUpRequest confirmSignUpRequest = buildConfirmSignUpRequest(email, verifikationCode, secretHash);
            cognitoClient.confirmSignUp(confirmSignUpRequest);
            return true;
        } catch (CognitoIdentityProviderException e) {
            logger.error("Error verifying code", e);
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
            InitiateAuthRequest authRequest = buildAuthRequest(email, password, secretHash);
            InitiateAuthResponse authResponse = cognitoClient.initiateAuth(authRequest);
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
            System.err.println("Fehler beim Abmelden des Benutzers: " + e.getMessage()); // Log die Nachricht
            e.printStackTrace();
            throw new RuntimeException("Fehler beim Abmelden des Benutzers: " + e.getMessage(), e);
        }
    }


/**
     * Berechnet den SECRET_HASH für Cognito.
     * @param clientSecret Das Client-Secret
     * @param clientId Die App-Client-ID
     * @return Der berechnete SECRET_HASH*/


    public String calculateSecretHash(String clientSecret,String email, String clientId) {
        if (clientSecret == null) {
            throw new IllegalArgumentException("Client secret must not be null");
        }

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

    private SignUpRequest buildSignUpRequest(String email, String password, String secretHash) {
        return SignUpRequest.builder()
                .clientId(userPoolClientId)
                .username(email)
                .password(password)
                .userAttributes(
                        AttributeType.builder()
                                .name("email")
                                .value(email)
                                .build()
                )
                .secretHash(secretHash)
                .build();
    }

    private ConfirmSignUpRequest buildConfirmSignUpRequest(String email, String verificationCode, String secretHash) {
        return ConfirmSignUpRequest.builder()
                .clientId(userPoolClientId)
                .username(email)
                .confirmationCode(verificationCode)
                .secretHash(secretHash)
                .build();
    }

    private InitiateAuthRequest buildAuthRequest(String email, String password, String secretHash) {
        return InitiateAuthRequest.builder()
                .clientId(userPoolClientId)
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .authParameters(Map.of(
                        "USERNAME", email,
                        "PASSWORD", password,
                        "SECRET_HASH", secretHash
                ))
                .build();
    }

    public String getClientSecret() {
        return this.userPoolClientSecret;
    }


}
