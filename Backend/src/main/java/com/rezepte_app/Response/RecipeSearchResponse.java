package com.rezepte_app.Response;

import com.rezepte_app.dto.SpoonRezepteDTO;

import java.util.List;

public class RecipeSearchResponse {

    private List<SpoonRezepteDTO> results;  // Die tatsächlichen Rezepte
    private int totalResults;               // Die Gesamtzahl der Ergebnisse (optional)

    // Getter und Setter
    public List<SpoonRezepteDTO> getResults() {
        return results;
    }

    public void setResults(List<SpoonRezepteDTO> results) {
        this.results = results;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
    }
}
