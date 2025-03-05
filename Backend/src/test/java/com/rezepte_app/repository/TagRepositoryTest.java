/*TODO:Paketname anpassen zu com.dishlist_app*//*

package com.rezepte_app.repository;

import com.rezepte_app.model.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


//Arrang, Act, Assert
@DataJpaTest
class TagRepositoryTest {

    @Autowired
    private TagRepository tagRepository;

    @Test
    void shouldSaveAndFindTag() {
        Tag tag = new Tag();
        tag.setLabel("Vegan");
        tag.setType("Kategorie"); // Muss gesetzt sein!

        Tag savedTag = tagRepository.save(tag);
        Optional<Tag> foundTag = tagRepository.findByLabel("Vegan");

        assertTrue(foundTag.isPresent());
        assertEquals("Vegan", foundTag.get().getLabel());
        assertEquals("Kategorie", foundTag.get().getType());
    }

    @Test
    void shouldFindByIdAndLabel() {
        // Arrange
        Tag tag = new Tag();
        tag.setLabel("TestTag");
        Tag savedTag = tagRepository.save(tag);

        // Act
        Optional<Tag> foundTag = tagRepository.findById(tag.getId());

        // Assert
        assertTrue(foundTag.isPresent());
        assertEquals("TestTag", foundTag.get().getLabel());
        assertEquals(savedTag.getId(), foundTag.get().getId());
    }

    @Test
    void shouldReturnEmptyWhenTagNotFound() {
        // Act
        Optional<Tag> foundTag = tagRepository.findByLabel("Nicht vorhanden");

        // Assert
        assertTrue(foundTag.isEmpty());
    }
}
*/
