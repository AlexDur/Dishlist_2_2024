package com.rezepte_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/openai")
@CrossOrigin(origins = "*")
public class OpenAIController {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIController.class);

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openAiApiUrl;

    private final RestTemplate restTemplate;

    @Autowired
    public OpenAIController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, Object> request) {
        try {
            logger.info("Received OpenAI chat request: {}", request);

            // Set up headers for OpenAI API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openAiApiKey);

            // Create request entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            // Make request to OpenAI API
            ResponseEntity<String> response = restTemplate.postForEntity(openAiApiUrl, entity, String.class);

            logger.info("OpenAI API response status: {}", response.getStatusCode());
            
            // Parse the OpenAI response and extract the recipe JSON
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseNode = objectMapper.readTree(response.getBody());
            
            // Extract the content from choices[0].message.content
            String recipeJson = responseNode.get("choices").get(0).get("message").get("content").asText();
            
            logger.info("Extracted recipe JSON: {}", recipeJson);
            return ResponseEntity.ok(recipeJson);

        } catch (Exception e) {
            logger.error("Error calling OpenAI API", e);
            return ResponseEntity.status(500).body("Error calling OpenAI API: " + e.getMessage());
        }
    }
} 