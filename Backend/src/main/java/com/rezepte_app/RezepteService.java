package com.rezepte_app;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RezepteService {

    private static final Logger logger = LoggerFactory.getLogger(RezepteService.class);

    @Autowired
    private TagService tagService;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private RezepteRepository rezepteRepository;

    // Im RezepteService
    public List<Rezept> fetchAlleRezepte() {
        List<Rezept> alleRezepte = rezepteRepository.findAllByOrderByIdDesc();
        logger.info("Anzahl der abgerufenen Rezepte: {}", alleRezepte.size());

        // Optional: Loggen Sie einige Details der abgerufenen Rezepte
        if (logger.isDebugEnabled()) {
            alleRezepte.forEach(rezept -> logger.debug("Rezept: {}", rezept));
        }

        return alleRezepte;
    }

    // Methode zum Hinzufügen eines Tags zu einem Rezept
    @Transactional
    public void addTagToRezept(int rezeptId, Tag tag) {
        Optional<Rezept> rezeptOptional = rezepteRepository.findById(rezeptId);
        if (rezeptOptional.isPresent()) {
            Rezept rezept = rezeptOptional.get();
            Tag tagToAdd = tagService.addTag(tag);
            if (!rezept.getTags().contains(tagToAdd)) {
                rezept.getTags().add(tagToAdd);
                rezepteRepository.save(rezept);
            }
        } else {
            throw new IllegalArgumentException("Rezept mit der angegebenen ID wurde nicht gefunden.");
        }
    }



    private Set<Tag> verarbeiteUndSpeichereTags(Set<Tag> tags) {
        Set<Tag> verarbeiteteTags = new HashSet<>();
        for (Tag tag : tags) {
            Tag verarbeiteterTag = tagService.addTag(tag);
            verarbeiteteTags.add(verarbeiteterTag);
        }
        return verarbeiteteTags;
    }

    @Valid
    public Rezept createRezept(Rezept rezept) {
        if (rezept.getName() == null) {
            throw new IllegalArgumentException("Der Name des Rezepts darf nicht null sein.");
        }

        // Verwende TagService zum Hinzufügen/Verarbeiten von Tags
        Set<Tag> verarbeiteteTags = verarbeiteUndSpeichereTags(rezept.getTags());
        rezept.setTags(verarbeiteteTags);

        return rezepteRepository.save(rezept);
    }


    public Optional<Rezept> updateRezept(Rezept rezept) {
        Optional<Rezept> existingRezeptOptional = rezepteRepository.findById(rezept.getId());

        if (existingRezeptOptional.isPresent()) {
            Rezept existingRezept = existingRezeptOptional.get();

            // Setze die Felder von existingRezept basierend auf den Werten von rezept
            existingRezept.setName(rezept.getName());
            existingRezept.setOnlineAdresse(rezept.getOnlineAdresse());
            existingRezept.setDatum(rezept.getDatum());
            existingRezept.setStatus(rezept.getStatus());
            existingRezept.setBewertung(rezept.getBewertung());
            existingRezept.setIstGeaendert(rezept.isIstGeaendert());

            Set<Tag> verarbeiteteTags = verarbeiteUndSpeichereTags(rezept.getTags());
            existingRezept.setTags(verarbeiteteTags);

            return Optional.of(rezepteRepository.save(existingRezept));
        } else {
            logger.info("Rezept mit ID {} nicht gefunden.", rezept.getId());
            return Optional.empty();
        }
    }


    public boolean deleteRezept(int id) {
        try {
            rezepteRepository.deleteById(id);
            return true;
        } catch (Exception e) {

            logger.error("Fehler beim Löschen des Rezepts mit ID {}: {}", id, e.getMessage());
            return false;
        }
    }

}
