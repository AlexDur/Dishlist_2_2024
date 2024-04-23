package com.rezepte_app.service;

import com.rezepte_app.Tag;
import com.rezepte_app.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class ActiveTagService {

    private final TagRepository tagRepository;

    public ActiveTagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Set<Tag> setActiveTags(Set<Tag> tags) {
        // Speichern aller Tags als aktive Tags
        return new HashSet<>(tagRepository.saveAll(tags));
    }

/*    public Tag getActiveTags(int userId) {
        // Implementieren Sie die Logik, um das aktive Tag für den Benutzer abzurufen.
        return tagRepository.findById(userId).orElse(null); // Nur ein Platzhalter
    }*/
}

