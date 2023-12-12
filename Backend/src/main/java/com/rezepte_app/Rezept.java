package com.rezepte_app;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "rezepte") // Optional: Wenn die Tabelle einen anderen Namen hat als die Klasse
public class Rezept {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String beschreibung;

    // Konstruktor (kann beibehalten werden)
    public Rezept() {
        // Konstruktor ohne Argumente
    }

    // Getter und Setter für id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter und Setter für name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter und Setter für beschreibung
    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    // Weitere Methoden, Equals, HashCode und ToString können hier hinzugefügt werden
}
