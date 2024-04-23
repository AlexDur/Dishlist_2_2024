package com.rezepte_app;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.Set;

@Entity
/*Entität ist eine Klasse, die die Attribute und das Verhalten eines Objekts definiert.*/

@Table(name = "rezepte")
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
            name = "rezept_tag", // Name der Verknüpfungstabelle
            joinColumns = @JoinColumn(name = "rezept_id"), // Spalte, die auf die Rezept-ID verweist
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Spalte, die auf die Tag-ID verweist
    )
    private Set<Tag> tags = new HashSet<>();

    @Column(name = "istGeaendert")
    private boolean istGeaendert;

    public Rezept() {
        // Standardkonstruktor
    }

    // Getter und Setter für id
    public int getId() {
        return id;
    }

    // Getter und Setter
    public Set<Tag> getTags() {
        return tags;
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

    public String getOnlineAdresse() {
        return onlineAdresse;
    }

    public void setOnlineAdresse(String onlineAdresse) {
        this.onlineAdresse = onlineAdresse;
    }

    public java.sql.Date getDatum() {
        return datum;
    }

    public void setDatum(java.sql.Date datum) {
        this.datum = datum;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    // Getter und Setter für bewertung
    public int getBewertung() {
        return bewertung;
    }

    public void setBewertung(int bewertung) {
        this.bewertung = bewertung;
    }

    public boolean isIstGeaendert() {
        return istGeaendert;
    }

    public void setIstGeaendert(boolean istGeaendert) {
        this.istGeaendert = istGeaendert;
    }

    @PrePersist
    @PreUpdate
    private void validateTags() {
        for (Tag tag : tags) {
            if (tag.getLabel() == null || tag.getLabel().isEmpty()) {
                throw new IllegalArgumentException("AUS REZEPT.java: Ungültiges Tag-Label: " + tag.getLabel());
            }
            if (tag.getSeverity() == null || tag.getSeverity().isEmpty()) {
                throw new IllegalArgumentException("AUS REZEPT.java: Ungültiger Tag-Schweregrad: " + tag.getSeverity());
            }
        }
    }
}
