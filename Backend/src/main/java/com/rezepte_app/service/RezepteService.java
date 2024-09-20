package com.rezepte_app.service;

import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.hibernate.Hibernate;
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

        // Lade alle Tags für alle Rezepte in einer einzigen Abfrage
        for (Rezept rezept : alleRezepte) {
            Hibernate.initialize(rezept.getTags());
        }

        // Optional: Loggen einiger Details der abgerufenen Rezepte
        if (logger.isDebugEnabled()) {
            alleRezepte.forEach(rezept -> logger.debug("Rezept: {}", rezept));
        }

        return alleRezepte;
    }

    // Methode zum Hinzufügen eines Tags zu einem Rezept
    @Transactional
    public void addTagsToRezept(int rezeptId, List<Tag> tags) {
        Rezept rezept = rezepteRepository.findById(rezeptId)
                .orElseThrow(() -> new IllegalArgumentException("Rezept mit der angegebenen ID wurde nicht gefunden."));

        for (Tag tag : tags) {
            Tag tagToAdd = tagService.addTag(tag);  // Stellen Sie sicher, dass Ihre tagService.addTag Methode effizient ist
            if (!rezept.getTags().contains(tagToAdd)) {
                rezept.getTags().add(tagToAdd);
            }
        }
        rezepteRepository.save(rezept);  // Speichern außerhalb der Schleife für Effizienz
    }


    @Transactional
    public Rezept createRezept(@Valid Rezept rezept) {
        if (rezept.getTags() != null) {
            Set<Tag> savedTags = new HashSet<>();
            for (Tag tag : rezept.getTags()) {
                Tag savedTag = tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())
                        .orElseGet(() -> tagRepository.save(tag));
                savedTags.add(savedTag);
            }
            rezept.setTags(savedTags);
        }
        return rezepteRepository.save(rezept);
    }


    @Transactional
    public Optional<Rezept> updateRezept(@Valid Rezept rezept) {
        Optional<Rezept> existingRezeptOptional = rezepteRepository.findById(rezept.getId());

        if (existingRezeptOptional.isPresent()) {
            Rezept existingRezept = existingRezeptOptional.get();

            // Setzen der Felder von existingRezept basierend auf den Werten von rezept
            existingRezept.setName(rezept.getName());
            existingRezept.setOnlineAdresse(rezept.getOnlineAdresse());
            existingRezept.setDatum(rezept.getDatum());
            existingRezept.setStatus(rezept.getStatus());
            existingRezept.setBewertung(rezept.getBewertung());


            // Verarbeiten und Speichern der Tags direkt hier
            Set<Tag> savedTags = new HashSet<>();
            if (rezept.getTags() != null) {
                for (Tag tag : rezept.getTags()) {
                    Tag savedTag = tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())
                            .orElseGet(() -> {
                                logger.info("Tag nicht gefunden, neues Tag wird erstellt: {}", tag);
                                return tagRepository.save(tag);
                            });
                    savedTags.add(savedTag);
                }
            }
            existingRezept.setTags(savedTags);

            // Speichere das aktualisierte Rezept, wenn Tags vorhanden sind
            if (!savedTags.isEmpty()) {
                Rezept updatedRezept = rezepteRepository.save(existingRezept);
                logger.info("Rezept nach dem Update: {}", updatedRezept);
                return Optional.of(rezepteRepository.save(existingRezept));
            } else {
                logger.error("Ungültige Tags für das Rezept mit ID {}.", rezept.getId());
                // Hier könnten Sie eine spezifischere Fehlerbehandlung durchführen oder eine entsprechende Ausnahme werfen
                return Optional.empty();
            }
        } else {
            logger.info("Rezept mit ID {} nicht gefunden.", rezept.getId());
            return Optional.empty();
        }
    }


    public Tag updateTag(int tagId, String label) {
        // Suchen des Tags, Update durchführen und zurückgeben des aktualisierten Tags
        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new IllegalArgumentException("Tag nicht gefunden"));
        tag.setLabel(label);
        return tagRepository.save(tag);  // Speichert das aktualisierte Tag und gibt es zurück
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