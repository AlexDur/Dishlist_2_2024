package com.rezepte_app.service;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.dto.TagDTO;
import com.rezepte_app.model.TagType;
import com.rezepte_app.model.User;
import com.rezepte_app.model.mapper.RezeptMapper;
import com.rezepte_app.model.mapper.TagMapper;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.UserRepository;
import com.rezepte_app.service.ImageServices.ImageUploadService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.attribute.UserPrincipal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RezepteService {

    private static final Logger logger = LoggerFactory.getLogger(RezepteService.class);

    private final TagService tagService;
    private final RezeptMapper rezeptMapper;
    private final TagRepository tagRepository;
    private final JwtUtil jwtUtil;
    private final RezepteRepository rezepteRepository;
    private final ImageUploadService imageUploadService;
    private final TagMapper tagMapper;
    private final UserRepository userRepository;

    // Constructor-based Dependency Injection
    @Autowired
    public RezepteService(TagService tagService,
                          RezeptMapper rezeptMapper,
                          JwtUtil jwtUtil,
                          TagRepository tagRepository,
                          RezepteRepository rezepteRepository,
                          ImageUploadService imageUploadService,
                          TagMapper tagMapper,
                          UserRepository userRepository) {
        this.tagService = tagService;
        this.rezeptMapper = rezeptMapper;
        this.jwtUtil = jwtUtil;
        this.tagRepository = tagRepository;
        this.rezepteRepository = rezepteRepository;
        this.tagMapper = tagMapper;
        this.imageUploadService = imageUploadService;
        this.userRepository = userRepository;
    }

    // Im RezepteService
    public List<Rezept> fetchAlleRezepte(String token) {
        String userId = jwtUtil.getUserIdFromToken(token);
        List<Rezept> userRezepte = rezepteRepository.findAllByUser_IdOrderByIdDesc(userId);
        initializeTagsForRezepte(userRezepte);
        return userRezepte;
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
    public Rezept createRezept(@Valid RezeptDTO rezeptDTO, String userId, MultipartFile image, String imageUrl) throws IOException {
        Rezept rezept = convertDtoToRezept(rezeptDTO, userId);

        if (image != null && !image.isEmpty()) {
            handleImageUpload(rezept, image);
        } else if (imageUrl != null && !imageUrl.isBlank()) {
            rezept.setBildUrl(imageUrl);
        }

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
            // Convert all Tag objects to TagDTO objects
            List<TagDTO> tagDTOs = rezept.getTags().stream()
                    .map(tag -> tagMapper.convertToTagDTO((Tag) tag))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // Extract IDs of existing tags
            List<Long> existingTagIds = tagDTOs.stream()
                    .map(TagDTO::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // Fetch existing tags from database
            Map<Long, Tag> existingTagsMap = tagRepository.findAllById(existingTagIds).stream()
                    .collect(Collectors.toMap(Tag::getId, tag -> tag));

            // Update or create tags
            Set<Tag> updatedTags = tagDTOs.stream()
                    .map(tagDTO -> {
                        Tag tag = tagMapper.convertToTag(tagDTO);
                        return getOrCreateTag(tag, existingTagsMap);
                    })
                    .collect(Collectors.toSet());

            // Update tags in the recipe
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
                    .map(tagDTO -> {
                        // Konvertiere TagDTO in Tag Entity
                        Tag tag = tagRepository.findById(tagDTO.getId()).orElseGet(() -> {
                            Tag newTag = new Tag();
                            // Der TagType wird hier direkt verwendet, ohne Umwandlung in einen String
                            newTag.setType(TagType.valueOf(tagDTO.getType()));  // Hier wird der String in TagType umgewandelt
                            newTag.setLabel(tagDTO.getLabel());
                            newTag.setSelected(tagDTO.isSelected());
                            newTag.setCount(tagDTO.getCount());
                            return tagRepository.save(newTag);
                        });
                        return tag;
                    })
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
