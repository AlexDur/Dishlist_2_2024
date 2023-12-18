package com.rezepte_app;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RezepteService {

    @Autowired
    private RezepteRepository rezepteRepository;

    // Im RezepteService
    @Valid
    public List<Rezept> fetchAlleRezepte() {
        return rezepteRepository.findAll();
    }

    @Valid
    public Rezept createRezept(Rezept rezept) {
        // ...

        if (rezept.getName().isEmpty()) {
            throw new IllegalArgumentException("Der Name des Rezepts darf nicht leer sein.");
        }


        return rezepteRepository.save(rezept);
    }

    @Valid
    public Optional<Rezept> updateRezept(Rezept rezept) {
        Optional<Rezept> existingRezeptOptional = Optional.ofNullable(rezepteRepository.findById(rezept.getId()));
        if (existingRezeptOptional.isPresent()) {
            Rezept existingRezept = existingRezeptOptional.get();
            existingRezept.setName(rezept.getName());
         /*   existingRezept.setBeschreibung(rezept.getBeschreibung());*/
            existingRezept.setOnlineadresse(rezept.getOnlineAdresse());
            existingRezept.setDatum(rezept.getDatum());
            existingRezept.setKoch(rezept.getKoch());
            existingRezept.setStatus(rezept.getStatus());
            existingRezept.setBewertung(rezept.getBewertung());

            return Optional.of(rezepteRepository.save(existingRezept));
        } else {
            // Rezept nicht gefunden
            return Optional.empty();
        }
    }
    @Valid
    public boolean deleteRezept(int id) {
        Optional<Rezept> rezeptOptional = Optional.ofNullable(rezepteRepository.findById(id));

        if (rezeptOptional.isPresent()) {
            rezepteRepository.deleteById(id);
            return true; // Erfolgreich gelöscht
        } else {
            return false; // Rezept mit der angegebenen ID wurde nicht gefunden
        }
    }

}
