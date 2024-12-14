package com.rezepte_app.service;

import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;

@Component
public class JwtUtil {
    private static final String JWKS_URL = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_VpHHD5eiF/.well-known/jwks.json";

    public String getUserIdFromToken(String token) {
        try {
            // JWT-Token analysieren
            SignedJWT signedJWT = SignedJWT.parse(token);
            System.out.println("Parsed JWT: " + signedJWT);

            // Holen des "kid" (Key ID) aus dem JWT-Header
            String kid = signedJWT.getHeader().getKeyID();
            System.out.println("Extracted kid: " + kid);

            // Hole den PublicKey für den "kid" aus der JWKS-URL
            RSAKey rsaKey = getPublicKeyFromCognito(kid);
            System.out.println("RSA Key: " + rsaKey);

            // Verifiziere das JWT mit dem RSAKey
            RSASSAVerifier verifier = new RSASSAVerifier(rsaKey);
            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Token-Verifikation fehlgeschlagen.");
            }

            // Extrahiere die Claims (Payload) des JWT
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            System.out.println("JWT Claims: " + claims);

            // Gib die User-ID aus den Claims zurück (das "subject" im JWT ist häufig die User-ID)
            return claims.getSubject();

        } catch (Exception e) {
            e.printStackTrace(); // Ausgabe des Stacktraces für genauere Analyse
            throw new RuntimeException("Ungültiges JWT-Token.", e);
        }
    }


    // Hole den PublicKey für den angegebenen "kid" aus der JWKS-URL und gebe RSAKey zurück
    private RSAKey getPublicKeyFromCognito(String kid) throws Exception {
        URL url = new URL(JWKS_URL);  // URL zum JWKS-Endpunkt von Cognito
        BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));

        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }

        // Parst das JWKS JSON und extrahiert den passenden PublicKey
        JWKSet jwkSet = JWKSet.parse(response.toString());
        JWK jwk = jwkSet.getKeyByKeyId(kid);
        if (jwk != null && jwk instanceof RSAKey) {
            return (RSAKey) jwk;  // Gib das RSAKey zurück
        } else {
            throw new RuntimeException("PublicKey für den angegebenen kid nicht gefunden oder ist kein RSAKey.");
        }
    }
}
