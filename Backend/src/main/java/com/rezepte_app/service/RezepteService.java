package com.rezepte_app.service;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.mapper.RezeptMapper;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.service.ImageServices.ImageUploadService;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RezepteService {

    private static final Logger logger = LoggerFactory.getLogger(RezepteService.class);

    private final TagService tagService;
    private final RezeptMapper rezeptMapper;
    private final TagRepository tagRepository;
    private final RezepteRepository rezepteRepository;
    private final ImageUploadService imageUploadService;

    // Constructor-based Dependency Injection
    @Autowired
    public RezepteService(TagService tagService,
                          RezeptMapper rezeptMapper,
                          TagRepository tagRepository,
                          RezepteRepository rezepteRepository,
                          ImageUploadService imageUploadService) {
        this.tagService = tagService;
        this.rezeptMapper = rezeptMapper;
        this.tagRepository = tagRepository;
        this.rezepteRepository = rezepteRepository;
        this.imageUploadService = imageUploadService;
    }

    // Im RezepteService
    @Transactional
    public List<Rezept> fetchAlleRezepte(String userId) {
        List<Rezept> alleRezepte = rezepteRepository.findByUserIdOrderByIdDesc(userId);
        logRezepteInfo(userId, alleRezepte);
        initializeTagsForRezepte(alleRezepte);
        return alleRezepte;
    }

    private void logRezepteInfo(String userId, List<Rezept> alleRezepte) {
        if (alleRezepte.isEmpty()) {
            logger.warn("Keine Rezepte für den Benutzer {} gefunden", userId);
        } else {
            logger.info("Anzahl der abgerufenen Rezepte: {}", alleRezepte.size());
        }
    }

    private void initializeTagsForRezepte(List<Rezept> alleRezepte) {
        // Tags der Rezepte in einer einzigen Abfrage laden
        for (Rezept rezept : alleRezepte) {
            Hibernate.initialize(rezept.getTags());
        }

        // Optional: Loggen der Details der abgerufenen Rezepte
        if (logger.isDebugEnabled()) {
            alleRezepte.forEach(rezept -> logger.debug("Rezept: {}", rezept));
        }
    }

    // Methode zum Hinzufügen eines Tags zu einem Rezept
    @Transactional
    public void addTagsToRezept(int rezeptId, List<Tag> tags) {
        Rezept rezept = rezepteRepository.findById((long) rezeptId)
                .orElseThrow(() -> new IllegalArgumentException("Rezept mit der angegebenen ID wurde nicht gefunden."));

        for (Tag tag : tags) {
            Tag tagToAdd = tagService.addTag(tag);
            if (tagToAdd != null && !rezept.getTags().contains(tagToAdd)) {
                rezept.getTags().add(tagToAdd);
            }
        }
        rezepteRepository.save(rezept);
    }

    //Hier Konvertierung des RezeptDTO zu Rezept
    @Transactional
    public Rezept createRezept(@Valid RezeptDTO rezeptDTO, String userId, MultipartFile image) throws IOException {
        Rezept rezept = convertDtoToRezept(rezeptDTO, userId);
        handleImageUpload(rezept, image);
        handleTags(rezept);
        return rezepteRepository.save(rezept);
    }

    private Rezept convertDtoToRezept(RezeptDTO rezeptDTO, String userId) {
        Rezept rezept = rezeptMapper.rezeptDTOToRezept(rezeptDTO);
        rezept.setUserId(userId);
        return rezept;
    }

    private void handleImageUpload(Rezept rezept, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String bildUrl = imageUploadService.uploadImage(image, 200, 400);
            rezept.setBildUrl(bildUrl);
        }
    }

    private void handleTags(Rezept rezept) {
        if (rezept.getTags() != null && !rezept.getTags().isEmpty()) {
            List<Long> existingTagIds = rezept.getTags().stream()
                    .map(Tag::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            Map<Long, Tag> existingTagsMap = tagRepository.findAllById(existingTagIds).stream()
                    .collect(Collectors.toMap(Tag::getId, tag -> tag));

            Set<Tag> updatedTags = rezept.getTags().stream()
                    .map(tag -> getOrCreateTag(tag, existingTagsMap))
                    .collect(Collectors.toSet());

            rezept.setTags(new ArrayList<>(updatedTags));
        }
    }

    private Tag getOrCreateTag(Tag tag, Map<Long, Tag> existingTagsMap) {
        if (tag.getId() != null && existingTagsMap.containsKey(tag.getId())) {
            return existingTagsMap.get(tag.getId());
        } else {
            return tagRepository.save(tag);
        }
    }


    @Transactional
    public Rezept updateRezept(Long id, RezeptDTO rezeptDTO, String userId, MultipartFile image) throws IOException {
        Rezept existingRezept = getExistingRezept(id);
        updateRezeptDetails(existingRezept, rezeptDTO, userId, image);
        return rezepteRepository.save(existingRezept);
    }

    private Rezept getExistingRezept(Long id) {
        return rezepteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rezept mit ID " + id + " nicht gefunden."));
    }

    private void updateRezeptDetails(Rezept existingRezept, RezeptDTO rezeptDTO, String userId, MultipartFile image) throws IOException {
        existingRezept.setName(rezeptDTO.getName());
        existingRezept.setOnlineAdresse(rezeptDTO.getOnlineAdresse());
        existingRezept.setUserId(userId);
        updateTags(existingRezept, rezeptDTO);
        handleImageUpload(existingRezept, image);
    }

    private void updateTags(Rezept existingRezept, RezeptDTO rezeptDTO) {
        if (rezeptDTO.getTags() != null) {
            Set<Tag> updatedTags = rezeptDTO.getTags().stream()
                    .map(tag -> tagRepository.findById(tag.getId()).orElseGet(() -> tagRepository.save(tag)))
                    .collect(Collectors.toSet());
            existingRezept.setTags(new ArrayList<>(updatedTags));
        }
    }


    @Transactional
    public Tag updateTag(int tagId, String label) {
        // Suchen des Tags, Update durchführen und zurückgeben des aktualisierten Tags
        Tag tag = tagRepository.findById((long) tagId).orElseThrow(() -> new IllegalArgumentException("Tag nicht gefunden"));
        tag.setLabel(label);
        return tagRepository.save(tag);
    }

    @Transactional
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
