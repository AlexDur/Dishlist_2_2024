package com.rezepte_app.service;

import com.rezepte_app.dto.TagDTO;
import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.rezepte_app.model.mapper.TagMapper;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    public TagService(TagRepository tagRepository, TagMapper tagMapper) {
        this.tagRepository = tagRepository;
        this.tagMapper = tagMapper;
    }

    @Transactional
    public Tag addTag(Tag tag) {
        return tagRepository.save(tag);
    }



    @Transactional
    public List<Tag> saveTags(List<Tag> tags) {
        tags.forEach(this::validateTag);
        return tagRepository.saveAll(tags);
    }

    private void validateTag(Tag tag) {
        if (tag == null || tag.getLabel() == null || tag.getLabel().isBlank()) {
            throw new IllegalArgumentException("Tag label must not be null or empty");
        }
    }


    // Methode, die eine Liste von Tags als DTOs zurückgibt
    public List<TagDTO> getAllTagsDTO() {
        return tagRepository.findAll()
                .stream()
                .map(tagMapper::convertToTagDTO) // Mapping von Tag auf TagDTO
                .collect(Collectors.toList());
    }

    // Methode, die ein einzelnes Tag als DTO zurückgibt
    public TagDTO getTagDTO(Long id) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        return tagMapper.convertToTagDTO(tag);
    }
}
