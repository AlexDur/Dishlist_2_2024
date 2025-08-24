package com.rezepte_app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

// Für die Verifizierung des Codes
public class
VerfikationCodeDto {


    @JsonProperty("verifikationCode")
    private String verifikationCode;
    private String email;

    public VerfikationCodeDto(String verifikationCode, String email) {
        this.verifikationCode = verifikationCode;
        this.email = email;
    }

    // Getter und Setter
    public String getVerifikationCode() {
        return verifikationCode;
    }

    public String getEmail() {
        return email;
    }

}
