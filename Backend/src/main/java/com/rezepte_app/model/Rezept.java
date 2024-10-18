package com.rezepte_app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    // Get ID method
    public Integer getId() {
        return Math.toIntExact((long) id);
    }

    public List<Tag> getTags() {
        Object tags = null;
        return (List<Tag>) tags;
    }

    public String getOnlineAdresse() {
        String onlineAdresse = "";
        return onlineAdresse;
    }

    public void setTags(Set<Tag> tags) {
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

    @JsonProperty("name")
    @Column(name = "name")
    private String name;

    @Column(name = "onlineAdresse")
    private String onlineAdresse;


    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "rezept_tags",
            joinColumns = @JoinColumn(name = "rezept_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();


    @PrePersist
    @PreUpdate
    private void validateTags() {
        for (Tag tag : tags) {
            if (tag.getLabel() == null || tag.getLabel().isEmpty()) {
                throw new IllegalArgumentException("AUS REZEPT.java: Ungültiges Tag-Label: " + tag.getLabel());
            }
        }
    }

    public boolean getStatus() {
        return false;
    }
}
