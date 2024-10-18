/*
SOLLTE EINE TESTKLASSE FÜR OPENAPI IM BROWSER SEIN

package com.rezepte_app.controller;

import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
public class RezeptController {

    @GetMapping("/Rezept/{id}")
    public ResponseEntity<Rezept> getRezept (@PathVariable int id) {
        // Erstellen von Beispiel-Tags
        Tag tag1 = new Tag();
        tag1.setId(1);
        tag1.setLabel("Deutsch");
        tag1.setType("Nachtisch");
        // Erstellen des Rezept-Objekts mit Testwerten
        Set<Tag> tags = new HashSet<>();
        tags.add(tag1);

        Rezept rezept = Rezept.builder()
                .id(id) // Beispiel-ID aus der Path-Variable
                .name("Schokoladenkuchen")
                .onlineAdresse("https://example.com")
                .tags(tags)
                .build();

        return ResponseEntity.ok(rezept);
    }
    }

*/
