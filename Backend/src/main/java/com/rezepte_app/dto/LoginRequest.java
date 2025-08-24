// Für Anmeldung in Cognito nur diese drei Paras nötig

package com.rezepte_app.dto;

public class LoginRequest {
    private String email;
    private String password;

    // Getter und Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


}
