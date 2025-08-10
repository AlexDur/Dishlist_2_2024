package com.rezepte_app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String frageRezeptvorschlag(String prompt) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String body = """
    {
      "model": "gpt-3.5-turbo"
      "messages": [
        { "role": "system", "content": "Du bist ein Rezeptassistent. Gib ein konkretes Rezept mit Zutaten und Zubereitung zurück." },
        { "role": "user", "content": "%s" }
      ],
      "temperature": 0.7
    }
    """.formatted(prompt);

        HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

        // Store the raw response body here
        String rawResponse = response.getBody(); // Corrected line

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(rawResponse);
            // Den relevanten Text extrahieren
            String recipeText = root.path("choices").get(0).path("message").path("content").asText();
            return recipeText;
        } catch (Exception e) {
            System.err.println("Fehler beim Parsen der OpenAI-Antwort: " + e.getMessage());
            return "Fehler beim Abrufen des Rezepts."; // Fehlerbehandlung
        }
    }
}