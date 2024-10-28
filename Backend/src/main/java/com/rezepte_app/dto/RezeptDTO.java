package com.rezepte_app.dto;

import com.rezepte_app.model.Tag;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RezeptDTO {
    private Long id; // Oder Integer, je nach deiner Datenbankkonfiguration
    private String name;
    private String onlineAdresse;
    private List<Tag> tags; // Liste von Tag-Objekten
    private String bildUrl;

    // Getter und Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public String getOnlineAdresse() {
        return onlineAdresse;
    }

    public void setOnlineAdresse(String onlineAdresse) {
        this.onlineAdresse = onlineAdresse;
    }

    @Override
    public String toString() {
        return "RezeptDTO{" +
                "name='" + name + '\'' +
                ", onlineAdresse='" + onlineAdresse + '\'' +
                '}';
    }
}
