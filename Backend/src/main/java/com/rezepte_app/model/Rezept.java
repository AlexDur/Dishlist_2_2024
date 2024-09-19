package com.rezepte_app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
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
    private int id;

    @JsonProperty("name")
    @Column(name = "name")
    private String name;

    @Column(name = "onlineAdresse")
    private String onlineAdresse;

    private java.sql.Date datum;

    @NotNull
    @Column(name = "status")
    private boolean status;

    @NotNull
    @Column(name = "bewertung")
    private int bewertung;

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
