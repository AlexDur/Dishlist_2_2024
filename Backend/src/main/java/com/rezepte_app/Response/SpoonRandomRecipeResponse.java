package com.rezepte_app.Response;

import com.rezepte_app.dto.SpoonRezepteDTO;

import java.util.List;

public class SpoonRandomRecipeResponse {
    private List<SpoonRezepteDTO> recipes;

    // Getter für recipes
    public List<SpoonRezepteDTO> getRecipes() {
        return recipes;
    }

    // Setter für recipes (optional, falls nötig)
    public void setRecipes(List<SpoonRezepteDTO> recipes) {
        this.recipes = recipes;
    }
}
