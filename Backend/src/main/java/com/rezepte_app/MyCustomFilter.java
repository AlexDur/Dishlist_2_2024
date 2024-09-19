package com.rezepte_app;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class MyCustomFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialisierungscode, falls erforderlich
    }

    @Override
    public void doFilter(javax.servlet.ServletRequest request,
                         javax.servlet.ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Deine Filterlogik hier

        // Beispiel: Header überprüfen
        String header = httpRequest.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            // Falls kein gültiger Authorization-Header vorhanden ist, Anfrage blockieren oder weiterleiten
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return;
        }

        // Filterkette fortsetzen
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Bereinigungslogik, falls erforderlich
    }
}
