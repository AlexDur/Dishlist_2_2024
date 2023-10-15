package com.rezepte_app;
public class Rezept {
    private int id;
    private String name;
    private String beschreibung;

    // Konstruktor
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
}
