package com.rezepte_app;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "rezepte") // Wenn die Tabelle einen anderen Namen hat als die Klasse
public class Rezept {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private String name;

    @Column(name = "onlineAdresse")
    private String onlineAdresse;
    private java.sql.Date datum;

    private String person;

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

    public String getperson() {
        return person;
    }

    public void setperson(String person) {
        this.person = person;
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
