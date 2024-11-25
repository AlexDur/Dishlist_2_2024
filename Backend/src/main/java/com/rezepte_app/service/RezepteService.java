package com.rezepte_app.service;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.mapper.RezeptMapper;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RezepteService {

    private static final Logger logger = LoggerFactory.getLogger(RezepteService.class);

    @Autowired
    private TagService tagService;

    @Autowired
    private final RezeptMapper rezeptMapper;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private RezepteRepository rezepteRepository;

    @Autowired
    private ImageUploadService imageUploadService;


    public RezepteService(RezeptMapper rezeptMapper) {
        this.rezeptMapper = rezeptMapper;
    }

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

    //Hier Konvertierung des RezeptDTO zu Rezept
    @Transactional
    public Rezept createRezept(@Valid RezeptDTO rezeptDTO, MultipartFile image) throws IOException {
        // RezeptDTO zu Rezept konvertieren
        Rezept rezept = rezeptMapper.rezeptDTOToRezept(rezeptDTO);
        logger.info("Nach Mapping - Name: {}, OnlineAdresse: {}", rezept.getName(), rezept.getOnlineAdresse());
        logger.info("Empfangenes Rezept: {}", rezeptDTO);

        // Bildverarbeitung und -speicherung
        if (image != null && !image.isEmpty()) {
            String bildUrl = imageUploadService.uploadImage(image, 200, 400);
            rezept.setBildUrl(bildUrl);
        }

        // Tags verarbeiten
        if (rezept.getTags() != null && !rezept.getTags().isEmpty()) {
            Set<Tag> updatedTags = rezept.getTags().stream()
                    .map(tag -> {
                        if (tag.getId() != null) {
                            // Tag mit der ID suchen
                            return tagRepository.findById(tag.getId())
                                    .orElseGet(() -> {
                                        // Tag ist nicht vorhanden, neu speichern
                                        return tagRepository.save(tag);
                                    });
                        } else {
                            // Tag-ID ist null, also direkt neu speichern
                            return tagRepository.save(tag);
                        }
                    })
                    .collect(Collectors.toSet());
            rezept.setTags(new ArrayList<>(updatedTags));

        }

        // Rezept speichern
        return rezepteRepository.save(rezept);
    }


    @Transactional
    public Optional<Rezept> updateRezept(@Valid Rezept rezept) {
        Optional<Rezept> existingRezeptOptional = rezepteRepository.findById(Math.toIntExact(rezept.getId()));

        if (existingRezeptOptional.isPresent()) {
            Rezept existingRezept = existingRezeptOptional.get();

            // Setzen der Felder von existingRezept basierend auf den Werten von rezept
            existingRezept.setName(rezept.getName());
            existingRezept.setOnlineAdresse(rezept.getOnlineAdresse());

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
            existingRezept.setTags((List<Tag>) savedTags);

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
        Tag tag = tagRepository.findById((long) tagId).orElseThrow(() -> new IllegalArgumentException("Tag nicht gefunden"));
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
