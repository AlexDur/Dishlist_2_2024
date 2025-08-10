package com.rezepte_app.controller;

import com.rezepte_app.service.SpoonacularService;
import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.dto.SpoonRezepteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spoonacular")
public class SpoonacularController {

    private final SpoonacularService spoonacularService;

    @Autowired
    public SpoonacularController(SpoonacularService spoonacularService) {
        this.spoonacularService = spoonacularService;
    }

  /*  @GetMapping("/random-rezepte")
    public ResponseEntity<List<SpoonRezepteDTO>> getRandomRecipes(@RequestParam String apiKey) {
        if (isValidApiKey(apiKey)) {  // API-Key-Validierung (z.B. gegen eine Liste von erlaubten Schlüsseln)
            List<SpoonRezepteDTO> randomRecipes = spoonacularService.fetchRandomRecipes();
            return ResponseEntity.ok(randomRecipes);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // Wenn der API-Key ungültig ist
        }
    }


    @GetMapping("/rezepte")
    public ResponseEntity<?> getRezepteVonSpoonacular(@RequestParam String query, @RequestParam int number) {
        try {
            // Abrufen der Daten von Spoonacular
            Object rezepte = spoonacularService.searchRecipes(query, number);
            return ResponseEntity.ok(rezepte);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Fehler bei der Kommunikation mit Spoonacular: " + e.getMessage());
        }
    }*/


    @GetMapping("/search")
    public ResponseEntity<List<RezeptDTO>> searchRecipes(@RequestParam String query, @RequestParam(required = false) List<String> tags) {
        // Service-Methode für Spoonacular-API-Aufruf
        return null;
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<SpoonRezepteDTO> getRecipeDetails(@PathVariable int id) {
        // Service-Methode für Spoonacular-API-Aufruf
        return null;
    }

    @GetMapping("/test-spoonacular")
    public ResponseEntity<String> testSpoonacularApi() {
        String apiResponse = spoonacularService.testSpoonacularApi();
        return ResponseEntity.ok(apiResponse);
    }


    private boolean isValidApiKey(String apiKey) {
        // Beispiel-Validierung, z.B. Prüfung gegen einen vordefinierten Schlüssel
        String validApiKey = "d63b99bd1aaa4d149becceeaf5659548";  // Beispiel, hier kannst du deinen eigenen Schlüssel verwenden
        return apiKey.equals(validApiKey);
    }
}
