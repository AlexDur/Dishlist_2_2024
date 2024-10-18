package com.rezepte_app.dto;

import com.rezepte_app.model.Tag;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RezeptDTO {
    private int id;
    private String name;
    private String onlineAdresse;
    private Set<TagDTO> tags;
}
