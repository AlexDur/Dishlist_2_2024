package com.rezepte_app;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends MyCustomFilter {

    private String secretKey = "secure-secret-key-for-testing"; // Hardcodierter Secret Key

    // Konstruktor ohne Parameter für den Testzwecke
    public JwtAuthenticationFilter() {}

    // Konstruktor mit Secret Key als Parameter
    public JwtAuthenticationFilter(String secretKey) {
        this.secretKey = secretKey;
    }

    @Override
    public void doFilter(javax.servlet.ServletRequest request,
                         javax.servlet.ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String header = httpRequest.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            // Weiter zur nächsten Filterkette, wenn kein gültiger Authorization-Header vorhanden ist
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // "Bearer " abschneiden

        try {
            // JWT-Token validieren und Claims extrahieren
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();

            if (username != null) {
                // Benutzer authentifizieren
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (ExpiredJwtException e) {
            // Token abgelaufen
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT token expired");
            return;
        } catch (SignatureException e) {
            // Ungültige Signatur
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT signature");
            return;
        } catch (Exception e) {
            // Genereller Fehler bei der Verarbeitung des JWT-Tokens
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
            return;
        }

        // Weiter zur nächsten Filterkette
        chain.doFilter(request, response);
    }
}
