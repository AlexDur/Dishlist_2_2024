// RezepteService.java
package com.rezepte_app.service;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RezepteService {

    @Autowired
    private RezepteRepository rezepteRepository;

    public void fetchAndPrintRezepte() {
        List<Rezept> rezepte = rezepteRepository.findAll();
        for (Rezept rezept : rezepte) {
            System.out.println("Name: " + rezept.getName());
            System.out.println("Beschreibung: " + rezept.getBeschreibung());
        }
    }
}
