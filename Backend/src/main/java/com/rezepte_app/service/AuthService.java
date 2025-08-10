package com.rezepte_app.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.rezepte_app.model.User;
import com.rezepte_app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Map;

//Zur Interaktion mit AWS Cognito für die Benutzerregistrierung, Authentifizierung und Verifizierung von E-Mail-Codes.

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);


    private final CognitoIdentityProviderClient cognitoClient;
    private final String userPoolClientId;
    private final String userPoolClientSecret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public AuthService(CognitoIdentityProviderClient cognitoClient,
                       @Value("${aws.cognito.userPoolClientId}") String userPoolClientId,
                       @Value("${aws.cognito.userPoolClientSecret}") String userPoolClientSecret) {
        this.cognitoClient = cognitoClient;
        this.userPoolClientId = userPoolClientId;
        this.userPoolClientSecret = userPoolClientSecret;
    }

    public SignUpResponse registerUser(String email, String password) {

        try {
            String secretHash = calculateSecretHash(this.userPoolClientSecret, email, this.userPoolClientId);
            SignUpResponse response = registerUserWithSecretHash(email, password, secretHash);

            String userId = response.userSub();
            if (userId == null || userId.isEmpty()) {
                // Falls die Benutzer-ID nicht vorhanden ist, wird ein Fehler geworfen
                throw new RuntimeException("Registrierung fehlgeschlagen: Cognito-Nutzer nicht bestätigt.");
            }


            return response;
        } catch (CognitoIdentityProviderException e) {
            if (e.awsErrorDetails().errorCode().equals("UsernameExistsException")) {
                logger.error("Benutzer mit der E-Mail-Adresse {} existiert bereits.", email);
                throw new RuntimeException("Benutzer mit dieser E-Mail-Adresse existiert bereits.");
            } else {
                logger.error("Fehler bei der Benutzerregistrierung", e);
                throw new RuntimeException("Fehler bei der Benutzerregistrierung: " + e.getMessage(), e);
            }
        }
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
            saveCognitoUserId(authResponse.authenticationResult().idToken()); // Benutzer-ID speichern

            return authResponse.authenticationResult().accessToken();

        } catch (Exception e) {
            e.printStackTrace();
            // Fehlerbehandlung (falls das Authentifizierungsverfahren fehlschlägt)
            System.err.println("Fehler bei der Authentifizierung: " + e.getMessage());
            throw new RuntimeException("Fehler bei der Authentifizierung: " + e);
        }
    }

    private void saveCognitoUserId(String cognitoIdToken) {
        // Extrahieren der Benutzer-ID aus dem Cognito-Token (idToken oder accessToken)
        String userId = extractUserIdFromCognitoToken(cognitoIdToken);
        if (!userId.isEmpty()) {
            User user = new User();
            user.setId(userId);
            userRepository.save(user);
            logger.info("Cognito Benutzer-ID gespeichert: {}", userId);
        } else {
            logger.warn("Benutzer-ID konnte nicht extrahiert werden.");
        }
    }

    private String extractUserIdFromCognitoToken(String cognitoIdToken) {
        if (cognitoIdToken == null || cognitoIdToken.trim().isEmpty() || !cognitoIdToken.contains(".")) {
            logger.error("Das übergebene Token ist ungültig oder leer: {}", cognitoIdToken);
            return null;  // Oder eine spezifische Exception werfen
        }
        try {
            DecodedJWT jwt = JWT.decode(cognitoIdToken);
            String userId = jwt.getSubject(); // Benutzer-ID (sub-Claim) extrahieren
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("Benutzer-ID aus dem Token konnte nicht extrahiert werden: {}", cognitoIdToken);
                return null;
            }
            return userId;
        } catch (Exception e) {
            logger.error("Fehler beim Extrahieren der Benutzer-ID aus dem Cognito-Token: {}", cognitoIdToken, e);
            return null;
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
