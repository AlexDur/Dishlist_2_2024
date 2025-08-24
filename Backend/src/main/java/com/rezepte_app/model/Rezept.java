package com.rezepte_app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rezepte")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rezept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("name")
    @Column(name = "name")
    private String name;

    @Column(name="userid")
    private String userId;

    @Column(name = "onlineAdresse")
    private String onlineAdresse;


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "rezept_tags",
            joinColumns = @JoinColumn(name = "rezept_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();


    @Column(name = "bildUrl")
    @Nullable
    private String bildUrl;


    @PrePersist
    @PreUpdate
    private void validateTags() {
        for (Tag tag : tags) {
            if (tag.getLabel() == null || tag.getLabel().isEmpty()) {
                throw new IllegalArgumentException("AUS REZEPT.java: Ungültiges Tag-Label: " + tag.getLabel());
            }
        }
    }


    // Getter und Setter

    public Long getId() {
        return id;
    }

    public List<Tag> getTags() {
        return new ArrayList<>(tags); // Rückgabe der Tags als Liste
    }

    public String getOnlineAdresse() {
        return onlineAdresse;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOnlineAdresse(String onlineAdresse) {
        this.onlineAdresse = onlineAdresse;
    }

    public String getBildUrl() {
        return bildUrl;
    }

    public void setBildUrl(String bildUrl) {
        this.bildUrl = bildUrl;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}