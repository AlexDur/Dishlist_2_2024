package com.rezepte_app;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.Set;

@Entity
/*Entität ist eine Klasse, die die Attribute und das Verhalten eines Objekts definiert.*/

@Table(name = "rezepte") // Wenn die Tabelle einen anderen Namen hat als die Klasse
public class Rezept {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonProperty("name")
    private String name;

    @Column(name = "onlineAdresse")
    private String onlineAdresse;
    private java.sql.Date datum;

    @NotNull
    private boolean status;

    @NotNull
    private int bewertung;

    @ManyToMany
    @JoinTable(
            name = "rezept_tags",
            joinColumns = @JoinColumn(name = "rezept_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    // Getter und Setter
    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    private boolean istGeaendert;

    // Konstruktor (kann beibehalten werden)
    // Getter und Setter für id
    public int getId() {
        return id;
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


}
