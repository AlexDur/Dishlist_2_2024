package com.rezepte_app;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // Methode zum Hinzufügen eines neuen Tags, falls es noch nicht existiert
    // Transactional: Operationen werden innerhalb einer Transaktion durchgeführt.
    // Das bedeutet, dass entweder alle Änderungen erfolgreich durchgeführt oder im Fehlerfall komplett zurückgerollt werden.
    @Transactional
    public Tag addTag(Tag tag) {
        try {
            // Überprüfe, ob ein Tag mit dem gleichen Namen bereits existiert
            Optional<Tag> existingTag = tagRepository.findByLabelAndSeverity(tag.getLabel(), tag.getSeverity());

            if (existingTag.isPresent()) {
                // Ein Tag mit dem gleichen Namen existiert bereits, gib es zurück
                return existingTag.get();
            } else {
                // Speichere den neuen Tag, da er eindeutig ist
                return tagRepository.save(tag);
            }
        } catch (DataAccessException e) {
            // Log the exception, handle it, or rethrow it
            throw new ServiceException("Error adding tag", e);
        }
    }

    public List<Tag> saveTags(List<Tag> tags) {
        return tags.stream()
                .map(tagRepository::save)
                .collect(Collectors.toList());
    }


    // Methode zum Entfernen eines Tags
    @Transactional
    public void removeTag(Long tagId) {
        try {
            tagRepository.deleteById(Math.toIntExact(tagId));
        } catch (IllegalArgumentException e) {
            // Handle invalid ID exception
            throw new ServiceException("Invalid tag ID", e);
        } catch (DataAccessException e) {
            // Handle data access exception
            throw new ServiceException("Error removing tag", e);
        }
    }



    // Methode zum Suchen eines Tags nach Namen
    public Optional<Tag> findTagByLabelAndSeverity(String label, String severity) {
        try {
            return tagRepository.findByLabelAndSeverity(label, severity);
        } catch (RuntimeException e) {
            // Log the exception, handle it, or rethrow it
            throw new ServiceException("Error finding tag by label and severity", e);
        }
    }

    // Methode zum Aktualisieren eines Tags
    @Transactional
    public Tag updateTag(Tag tag) {
        try {
            return tagRepository.save(tag);
        } catch (RuntimeException e) {
            // Log the exception, handle it, or rethrow it
            throw new ServiceException("Error updating tag", e);
        }
    }
}
