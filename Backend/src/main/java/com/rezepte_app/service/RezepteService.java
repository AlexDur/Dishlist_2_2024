package com.rezepte_app.service;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.mapper.RezeptMapper;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
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
    @Transactional
    public List<Rezept> fetchAlleRezepte(String userId) {
        List<Rezept> alleRezepte = rezepteRepository.findByUserIdOrderByIdDesc(userId);
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
        Rezept rezept = rezepteRepository.findById((long) rezeptId)
                .orElseThrow(() -> new IllegalArgumentException("Rezept mit der angegebenen ID wurde nicht gefunden."));

        for (Tag tag : tags) {
            Tag tagToAdd = tagService.addTag(tag);
            if (!rezept.getTags().contains(tagToAdd)) {
                rezept.getTags().add(tagToAdd);
            }
        }
        rezepteRepository.save(rezept);
    }

    //Hier Konvertierung des RezeptDTO zu Rezept
    @Transactional
    public Rezept createRezept(@Valid RezeptDTO rezeptDTO, String userId, MultipartFile image) throws IOException {
        // RezeptDTO zu Rezept konvertieren
        Rezept rezept = rezeptMapper.rezeptDTOToRezept(rezeptDTO);
        logger.info("Nach Mapping - Name: {}, OnlineAdresse: {}", rezept.getName(), rezept.getOnlineAdresse());
        logger.info("Empfangenes Rezept: {}", rezeptDTO);

        rezept.setUserId(userId);
        logger.info("Rezept vor dem Speichern: {}", rezept);
        logger.info("UserId: {}", rezept.getUserId());


        // Bildverarbeitung und -speicherung
        if (image != null && !image.isEmpty()) {
            String bildUrl = imageUploadService.uploadImage(image, 200, 400);
            rezept.setBildUrl(bildUrl);
        }

        // Tags verarbeiten, wobei IDs gesammelt in einem einzigen Query geprüft werden
        if (rezept.getTags() != null && !rezept.getTags().isEmpty()) {

            List<Long> existingTagIds = rezept.getTags().stream()
                    .map(Tag::getId)
                    .filter(Objects::nonNull)
                    .toList();

            Map<Long, Tag> existingTagsMap = tagRepository.findAllById(existingTagIds).stream()
                    .collect(Collectors.toMap(Tag::getId, tag -> tag));

            // Tags verarbeiten und ggf. neu speichern
            Set<Tag> updatedTags = rezept.getTags().stream()
                    .map(tag -> {
                        if (tag.getId() != null && existingTagsMap.containsKey(tag.getId())) {
                            // Existierendes Tag aus der Map holen
                            return existingTagsMap.get(tag.getId());
                        } else {
                            // Neues Tag speichern
                            return tagRepository.save(tag);
                        }
                    })
                    .collect(Collectors.toSet());

            rezept.setTags(new ArrayList<>(updatedTags));
        }

        // Rezept speichern in Datenbank (DB)
        return rezepteRepository.save(rezept);
    }


    @Transactional
    public Rezept updateRezept(Long id, RezeptDTO rezeptDTO, String userId, MultipartFile image) throws IOException {
        Optional<Rezept> existingRezeptOptional = rezepteRepository.findById(id);
        if (existingRezeptOptional.isEmpty()) {
            throw new EntityNotFoundException("Rezept mit ID " + id + " nicht gefunden.");
        }

        Rezept existingRezept = existingRezeptOptional.get();

        if (rezeptDTO.getId() == null) {
            rezeptDTO.setId(id);
            System.out.println("rezeptDTO in RService null: " + rezeptDTO.getId());
        } else {
            System.out.println("ID in rezeptDTO ist nicht null: " + rezeptDTO.getId());
        }

        existingRezept.setName(rezeptDTO.getName());
        existingRezept.setOnlineAdresse(rezeptDTO.getOnlineAdresse());
        existingRezept.setUserId(userId);

        if (rezeptDTO.getTags() != null) {
            Set<Tag> updatedTags = rezeptDTO.getTags().stream()
                    .map(tag -> tagRepository.findById(tag.getId()).orElseGet(() -> tagRepository.save(tag)))
                    .collect(Collectors.toSet());
            existingRezept.setTags(new ArrayList<>(updatedTags));
            System.out.println("U_Tags erfolgreich aktualisiert.");
        } else {
            System.out.println("Tags NICHT erfolgreich aktualisiert.");
        }

        if (image != null && !image.isEmpty()) {
            String bildUrl = imageUploadService.uploadImage(image, 200, 400);
            existingRezept.setBildUrl(bildUrl);
            System.out.println("U_Bild erfolgreich verarbeitet.");
        } else {
            System.out.println("U_Bild NICHT erfolgreich verarbeitet.");
        }

        System.out.println("existingRezept sieht so aus" + existingRezept);

        return rezepteRepository.save(existingRezept);
    }




    public Tag updateTag(int tagId, String label) {
        // Suchen des Tags, Update durchführen und zurückgeben des aktualisierten Tags
        Tag tag = tagRepository.findById((long) tagId).orElseThrow(() -> new IllegalArgumentException("Tag nicht gefunden"));
        tag.setLabel(label);
        return tagRepository.save(tag);  // Speichert das aktualisierte Tag und gibt es zurück
    }


    public boolean deleteRezept(int id) {
        try {
            rezepteRepository.deleteById((long) id);
            return true;
        } catch (Exception e) {
            logger.error("Fehler beim Löschen des Rezepts mit ID {}: {}", id, e.getMessage());
            return false;
        }
    }

}
