package com.rezepte_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RezepteService {

    @Autowired
    private RezepteRepository rezepteRepository;

    // Im RezepteService
    public List<Rezept> fetchAlleRezepte() {
        return rezepteRepository.findAll();
    }


    public Rezept createRezept(Rezept rezept) {
        return rezepteRepository.save(rezept);
    }

    public Rezept updateRezept(Rezept rezept) {
        // Überprüfen, ob das Rezept in der Datenbank existiert
        Optional<Rezept> existingRezept = Optional.ofNullable(rezepteRepository.findById(rezept.getId()));
        if (existingRezept.isPresent()) {
            // Aktualisieren Sie die Eigenschaften des Rezepts
            Rezept updatedRezept = existingRezept.get();
            updatedRezept.setName(rezept.getName());
            updatedRezept.setBeschreibung((rezept.getBeschreibung()));
            updatedRezept.setOnlineadresse(rezept.getOnlineAdresse());
            updatedRezept.setDatum(rezept.getDatum());
            updatedRezept.setKoch(rezept.getKoch());
            updatedRezept.setStatus(rezept.getStatus());
            updatedRezept.setBewertung(rezept.getBewertung());
            // Speichern Sie das aktualisierte Rezept
            return rezepteRepository.save(updatedRezept);
        } else {
            // Das Rezept wurde nicht gefunden
            return null;
        }
    }

/*    public void deleteRezept(Long id) {
        // Löschen Sie das Rezept mit der angegebenen ID
        rezepteRepository.deleteById(id);
    }*/
}
