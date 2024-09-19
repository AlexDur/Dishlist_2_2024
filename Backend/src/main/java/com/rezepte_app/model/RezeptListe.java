package com.rezepte_app.model;

import jakarta.persistence.*;

import java.util.List;

public class RezeptListe {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "recipeList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rezept> recipes;
}
