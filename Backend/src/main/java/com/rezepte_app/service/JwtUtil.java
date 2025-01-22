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
import java.util.Optional;

@Component
public class JwtUtil {
    private static final String JWKS_URL = "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_VpHHD5eiF/.well-known/jwks.json";

    public String getUserIdFromToken(String token) {
        try {
            SignedJWT signedJWT = parseToken(token);
            String kid = extractKid(signedJWT);
            RSAKey rsaKey = fetchRsaKey(kid);
            validateToken(signedJWT, rsaKey);
            return extractUserId(signedJWT);
        } catch (Exception e) {
            throw new RuntimeException("Ungültiges JWT-Token.", e);
        }
    }

    private SignedJWT parseToken(String token) throws Exception {
        return SignedJWT.parse(token);
    }

    private String extractKid(SignedJWT signedJWT) {
        return Optional.ofNullable(signedJWT.getHeader().getKeyID())
                .orElseThrow(() -> new RuntimeException("Kein Key ID (kid) im JWT-Header gefunden."));
    }

    private RSAKey fetchRsaKey(String kid) throws Exception {
        JWKSet jwkSet = fetchJwkSet();
        JWK jwk = jwkSet.getKeyByKeyId(kid);
        if (jwk instanceof RSAKey rsaKey) {
            return rsaKey;
        } else {
            throw new RuntimeException("PublicKey für den angegebenen kid nicht gefunden oder ist kein RSAKey.");
        }
    }

    private JWKSet fetchJwkSet() throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(new URL(JWKS_URL).openStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return JWKSet.parse(response.toString());
        }
    }

    private void validateToken(SignedJWT signedJWT, RSAKey rsaKey) throws Exception {
        if (!signedJWT.verify(new RSASSAVerifier(rsaKey))) {
            throw new RuntimeException("Token-Verifikation fehlgeschlagen.");
        }
    }

    private String extractUserId(SignedJWT signedJWT) throws Exception {
        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
        return Optional.ofNullable(claims.getSubject())
                .orElseThrow(() -> new RuntimeException("Kein Benutzer-ID im JWT-Claims-Set gefunden."));
    }


}
