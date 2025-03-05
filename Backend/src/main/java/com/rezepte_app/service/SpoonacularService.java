package com.rezepte_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SpoonacularService {

    private final String baseUrl_spoon;
    private final String apiKey;
    private final RestTemplate restTemplate;

    @Autowired
    public SpoonacularService(@Value("${spoonacular.api.key}") String apiKey,
                              @Value("${spoonacular.base.url}") String baseUrl_spoon,
                              RestTemplateBuilder restTemplateBuilder) {
        this.apiKey = apiKey;
        this.baseUrl_spoon = baseUrl_spoon;
        this.restTemplate = restTemplateBuilder.build();
    }

/*    public List<SpoonRezepteDTO> searchRecipes(String query, int number) {
        String url = baseUrl_spoon + "/recipes/complexSearch?query=" + query + "&number=" + number + "&apiKey=" + apiKey;
        try {
            ResponseEntity<RecipeSearchResponse> response = restTemplate.getForEntity(url, RecipeSearchResponse.class);
            if (response.getBody() != null) {
                return response.getBody().getResults();  // Liste von Rezepten
            }
        } catch (Exception e) {
            System.err.println("Fehler bei der Rezeptsuche: " + e.getMessage());
        }
        return Collections.emptyList();
    }


    public List<SpoonRezepteDTO> fetchRandomRecipes() {
        try {
            String url = baseUrl_spoon + "/recipes/random?number=3&apiKey=" + apiKey;
            ResponseEntity<SpoonRandomRecipeResponse> response =
                    restTemplate.getForEntity(url, SpoonRandomRecipeResponse.class);

            if (response.getBody() != null) {
                return response.getBody().getRecipes();
            }
        } catch (Exception e) {
            System.err.println("Fehler beim Abrufen von zufälligen Rezepten: " + e.getMessage());
        }
        return Collections.emptyList();
    }*/



    public String testSpoonacularApi() {
        String url = baseUrl_spoon + "/recipes/complexSearch?query=tomato&number=5&apiKey=" + apiKey;
        try {
            // Sende die Anfrage an die API und erhalte die Antwort als String
            String response = restTemplate.getForObject(url, String.class);
            return response;  // Rückgabe der rohen JSON-Antwort
        } catch (Exception e) {
            System.err.println("Fehler bei der Anfrage an Spoonacular: " + e.getMessage());
            return "Fehler bei der Anfrage: " + e.getMessage();
        }
    }


}
