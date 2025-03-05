package com.rezepte_app.service;

import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Transactional
    public Tag addTag(Tag tag) {
        if (tag.getId() == null) {
            // Neues Tag: Nur nach Label suchen
            return tagRepository.findByLabel(tag.getLabel())
                    .orElseGet(() -> tagRepository.save(tag));
        } else {
            // Existierendes Tag: Nach ID und Label suchen
            return tagRepository.findByIdAndLabel(tag.getId(), tag.getLabel())
                    .orElseGet(() -> tagRepository.save(tag));
        }
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


  /*  public boolean existsByLabel(String label) {
        return tagRepository.findByLabel(label).isPresent();
    }*/
}
