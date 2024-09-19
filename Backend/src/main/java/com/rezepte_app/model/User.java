package com.rezepte_app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.enabled;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Benutzername darf nicht leer sein")
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Password darf nicht leer sein")
    @Size(min = 8, message = "Das Passwort muss mindestens 8 Zeichen lang sein")
    @Column(name = "password", nullable = false)
    private String password;

    @Email(message = "Bitte geben Sie eine gültige E-Mail-Adresse ein")
    @NotBlank(message = "E-Mail darf nicht leer sein")
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Setter
    @Getter
    private boolean enabled;

}
