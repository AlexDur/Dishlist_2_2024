/*
package com.rezepte_app.service;

import com.rezepte_app.model.Tag;
import com.rezepte_app.repository.TagRepository;
import org.hibernate.service.spi.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    private Tag tag;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        tag = new Tag();
        tag.setId(1L);
        tag.setLabel("Tag1");
    }

    @Test
    void testAddTag_TagExists() {
        // Vorbereitung: Wenn das Tag bereits existiert
        when(tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())).thenReturn(Optional.of(tag));

        // Ausführung
        Tag result = tagService.addTag(tag);

        // Verifikation: Das existierende Tag wird zurückgegeben
        assertNotNull(result);
        assertEquals(tag.getLabel(), result.getLabel());
        verify(tagRepository, times(1)).findByLabelAndId(tag.getLabel(), tag.getId());
        verify(tagRepository, times(0)).save(tag);  // save sollte nicht aufgerufen werden
    }

    @Test
    void testAddTag_TagDoesNotExist() {
        // Vorbereitung: Tag existiert noch nicht
        when(tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())).thenReturn(Optional.empty());
        when(tagRepository.save(tag)).thenReturn(tag);

        // Ausführung
        Tag result = tagService.addTag(tag);

        // Verifikation: Das neue Tag wird gespeichert und zurückgegeben
        assertNotNull(result);
        assertEquals(tag.getLabel(), result.getLabel());
        verify(tagRepository, times(1)).save(tag);  // save sollte aufgerufen werden
    }

    @Test
    void testRemoveTag_Success() {
        // Vorbereitung: Keine Exceptions beim Löschen
        doNothing().when(tagRepository).deleteById(tag.getId());

        // Ausführung
        tagService.removeTag(tag.getId());

        // Verifikation: Löschen wurde durchgeführt
        verify(tagRepository, times(1)).deleteById(tag.getId());
    }

    @Test
    void testRemoveTag_InvalidId() {
        // Vorbereitung: IllegalArgumentException wird geworfen
        doThrow(new IllegalArgumentException("Invalid ID")).when(tagRepository).deleteById(tag.getId());

        // Ausführung und Verifikation: Erwartet wird eine ServiceException
        assertThrows(ServiceException.class, () -> tagService.removeTag(tag.getId()));
    }

    @Test
    void testFindTagByLabelAndSeverity() {
        // Vorbereitung: Tag existiert
        when(tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())).thenReturn(Optional.of(tag));

        // Ausführung
        Optional<Tag> result = tagService.findTagByLabelAndSeverity(tag.getLabel(), tag.getId());

        // Verifikation: Das Tag wird gefunden
        assertTrue(result.isPresent());
        assertEquals(tag.getLabel(), result.get().getLabel());
    }

    @Test
    void testFindTagByLabelAndSeverity_TagNotFound() {
        // Vorbereitung: Tag existiert nicht
        when(tagRepository.findByLabelAndId(tag.getLabel(), tag.getId())).thenReturn(Optional.empty());

        // Ausführung
        Optional<Tag> result = tagService.findTagByLabelAndSeverity(tag.getLabel(), tag.getId());

        // Verifikation: Kein Tag wird gefunden
        assertFalse(result.isPresent());
    }

    @Test
    void testUpdateTag() {
        // Vorbereitung: Tag wird gespeichert
        when(tagRepository.save(tag)).thenReturn(tag);

        // Ausführung
        Tag result = tagService.updateTag(tag);

        // Verifikation: Das aktualisierte Tag wird zurückgegeben
        assertNotNull(result);
        assertEquals(tag.getLabel(), result.getLabel());
        verify(tagRepository, times(1)).save(tag);
    }

    @Test
    void testUpdateTag_Exception() {
        // Vorbereitung: Fehler beim Speichern des Tags
        when(tagRepository.save(tag)).thenThrow(new RuntimeException("Error updating tag"));

        // Ausführung und Verifikation: Erwartet wird eine ServiceException
        assertThrows(ServiceException.class, () -> tagService.updateTag(tag));
    }
}
*/
