package com.rezepte_app.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagDTO {
    private int id;
    private String label;
    private String type;
    private int count;
}
