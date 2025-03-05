package com.rezepte_app.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpoonRezepteDTO {
    private int id;
    private String title;
    private String image;
    private String sourceUrl;
    private List<String> dishTypes;
    private List<String> cuisines;
}