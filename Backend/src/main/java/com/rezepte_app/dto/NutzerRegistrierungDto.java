package com.rezepte_app.dto;

// für die Registrierung verwendet
public class NutzerRegistrierungDto {

    private String email;
    private String password;

    // Konstruktor
    public NutzerRegistrierungDto(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getter für das Passwort
    public String getPassword() {
        return password;
    }

    // Getter für die E-Mail
    public String getEmail() {
        return email;
    }

}
