/*
package com.rezepte_app;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class TagRepositoryTest {

    @Autowired
    private TagRepository tagRepository;

    @Test
    public void testFindByName() {
        String tagName = "TestTag";
        Tag newTag = new Tag();
        newTag.setName(tagName);
        tagRepository.save(newTag);

        Optional<Tag> foundTag = tagRepository.findByName(tagName);
        assertTrue(foundTag.isPresent());
        assertEquals(tagName, foundTag.get().getName());
    }
}
*/
