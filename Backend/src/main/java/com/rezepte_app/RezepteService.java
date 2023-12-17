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

        Optional<Rezept> existingRezept = Optional.ofNullable(rezepteRepository.findById(rezept.getId()));
        if (existingRezept.isPresent()) {

            Rezept updatedRezept = existingRezept.get();
            updatedRezept.setName(rezept.getName());
            updatedRezept.setBeschreibung((rezept.getBeschreibung()));
            updatedRezept.setOnlineadresse(rezept.getOnlineAdresse());
            updatedRezept.setDatum(rezept.getDatum());
            updatedRezept.setKoch(rezept.getKoch());
            updatedRezept.setStatus(rezept.getStatus());
            updatedRezept.setBewertung(rezept.getBewertung());

            return rezepteRepository.save(updatedRezept);
        } else {
            //  Rezept nicht gefunden
            return null;
        }
    }

/*    public void deleteRezept(Long id) {
        // Löschen des Rezepts mit angegebener ID
        rezepteRepository.deleteById(id);
    }*/
}
