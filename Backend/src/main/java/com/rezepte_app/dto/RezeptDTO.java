package com.rezepte_app.dto;

import com.rezepte_app.model.Tag;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RezeptDTO {
    private Long id;
    private String name;
    private String onlineAdresse;
    private List<Tag> tags; // Liste von Tag-Objekten
    private String bildUrl;
    private String userId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    // Setter für bildUrl
    public void setBildUrl(String bildUrl) {
        this.bildUrl = bildUrl;
    }

    // Getter für bildUrl
    public String getBildUrl() {
        return bildUrl;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "RezeptDTO{" +
                "name='" + name + '\'' +
                ", onlineAdresse='" + onlineAdresse + '\'' +
                '}';
    }
}
