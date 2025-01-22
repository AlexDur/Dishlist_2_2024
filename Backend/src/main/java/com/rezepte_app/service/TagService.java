package com.rezepte_app.service;

import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.TagRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Adds a new tag if it does not already exist.
     *
     * @param tag The tag to add.
     * @return The existing or newly created tag.
     */
    @Transactional
    public Tag addTag(Tag tag) {
        return tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())
                .orElseGet(() -> tagRepository.save(tag));
    }

    /**
     * Saves a list of tags.
     *
     * @param tags The tags to save.
     * @return The list of saved tags.
     */
    @Transactional
    public List<Tag> saveTags(List<Tag> tags) {
        return tags.stream()
                .map(tagRepository::save)
                .collect(Collectors.toList());
    }

    /**
     * Removes a tag by its ID.
     *
     * @param tagId The ID of the tag to remove.
     */
    @Transactional
    public void removeTag(Long tagId) {
        if (tagId == null || tagId <= 0) {
            throw new IllegalArgumentException("Invalid tag ID");
        }
        try {
            tagRepository.deleteById(tagId);
        } catch (DataAccessException e) {
            throw new RuntimeException("Error removing tag", e);
        }
    }

    /**
     * Updates a tag.
     *
     * @param tag The tag to update.
     * @return The updated tag.
     */
    @Transactional
    public Tag updateTag(Tag tag) {
        if (tag == null || tag.getId() == null) {
            throw new IllegalArgumentException("Tag or Tag ID must not be null");
        }
        return tagRepository.save(tag);
    }
}