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
    private String onlineadresse;
    private java.sql.Date datum; // Verwenden Sie java.sql.Date für das Datum
    private String koch;
    private boolean status; // Verwenden Sie boolean für den Status
    private int bewertung;

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

    // Getter und Setter für onlineadresse
    public String getOnlineAdresse() {
        return onlineadresse;
    }

    public void setOnlineadresse(String onlineadresse) {
        this.onlineadresse = onlineadresse;
    }

    // Getter und Setter für datum
    public java.sql.Date getDatum() {
        return datum;
    }

    public void setDatum(java.sql.Date datum) {
        this.datum = datum;
    }

    // Getter und Setter für koch
    public String getKoch() {
        return koch;
    }

    public void setKoch(String koch) {
        this.koch = koch;
    }

/*
    // Getter und Setter für status
    public boolean isStatus() {
        return status;
    }
*/

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

    // Weitere Methoden, Equals, HashCode und ToString können hier hinzugefügt werden
}
