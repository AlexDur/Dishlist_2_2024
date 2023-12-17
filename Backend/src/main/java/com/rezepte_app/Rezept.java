package com.rezepte_app;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "rezepte") // Wenn die Tabelle einen anderen Namen hat als die Klasse
public class Rezept {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    private String name;

    @NotNull
    private String beschreibung;

    @NotNull
    private String onlineadresse;
    private java.sql.Date datum;

    @NotNull
    private String koch;

    @NotNull
    private boolean status;

    @NotNull
    private int bewertung;

    // Konstruktor (kann beibehalten werden)
    // Getter und Setter für id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

    public String getOnlineAdresse() {
        return onlineadresse;
    }

    public void setOnlineadresse(String onlineadresse) {
        this.onlineadresse = onlineadresse;
    }

    public java.sql.Date getDatum() {
        return datum;
    }

    public void setDatum(java.sql.Date datum) {
        this.datum = datum;
    }

    public String getKoch() {
        return koch;
    }

    public void setKoch(String koch) {
        this.koch = koch;
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


}
