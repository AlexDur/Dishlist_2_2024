package com.rezepte_app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Order(Ordered.HIGHEST_PRECEDENCE)
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping(value = {"/", "/index.html"})
    public ResponseEntity<org.springframework.core.io.Resource> serveIndexHtml() {
        logger.info("Anfrage für '/' oder '/index.html' empfangen");

        ClassPathResource indexHtml = new ClassPathResource("static/index.html");
        logger.info("Suche nach Ressource: {}", indexHtml.getPath());
        logger.info("Ressource existiert: {}", indexHtml.exists());

        if (indexHtml.exists()) {
            logger.info("index.html gefunden. Sende Ressource zurück.");
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(indexHtml);
        } else {
            logger.warn("index.html nicht gefunden in {}", indexHtml.getPath());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{path:^(?!api)[^.]*}")
    public String redirect() {
        return "forward:/index.html";  // Nur für API-Routen weiterleiten
    }
}
