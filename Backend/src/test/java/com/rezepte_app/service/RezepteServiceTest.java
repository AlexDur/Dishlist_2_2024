/*
package com.rezepte_app.service;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import com.rezepte_app.model.Tag;
import com.rezepte_app.model.mapper.RezeptMapper;
import com.rezepte_app.repository.RezepteRepository;
import com.rezepte_app.repository.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Disabled
@SpringBootTest
@ExtendWith(SpringExtension.class)
class RezepteServiceTest {

    @Mock
    private RezepteRepository rezepteRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private TagService tagService;

    @Mock
    private RezeptMapper rezeptMapper;

    @Mock
    private ImageUploadService imageUploadService;

    @InjectMocks
    private RezepteService rezepteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFetchAlleRezepte() {
        // Vorbereitung
        Rezept rezept1 = new Rezept();
        rezept1.setId(1L);
        rezept1.setName("Test Rezept 1");

        Rezept rezept2 = new Rezept();
        rezept2.setId(2L);
        rezept2.setName("Test Rezept 2");

        when(rezepteRepository.findAllByOrderByIdDesc()).thenReturn(Arrays.asList(rezept1, rezept2));

        // Ausführung
        List<Rezept> result = rezepteService.fetchAlleRezepte();

        // Verifikation
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Rezept 1", result.get(0).getName());
        assertEquals("Test Rezept 2", result.get(1).getName());

        verify(rezepteRepository, times(1)).findAllByOrderByIdDesc();
    }

    @Test
    void testCreateRezept() throws IOException {
        // Vorbereitung
        RezeptDTO rezeptDTO = new RezeptDTO();
        rezeptDTO.setName("Neues Rezept");
        Rezept mappedRezept = new Rezept();
        mappedRezept.setName("Neues Rezept");

        MultipartFile image = mock(MultipartFile.class);
        when(rezeptMapper.rezeptDTOToRezept(rezeptDTO)).thenReturn(mappedRezept);
        when(imageUploadService.uploadImage(any(MultipartFile.class), eq(200), eq(400))).thenReturn("https://s3.bucket.url/image.jpg");
        when(rezepteRepository.save(any(Rezept.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Ausführung
        Rezept result = rezepteService.createRezept(rezeptDTO, image);

        // Verifikation
        assertNotNull(result);
        assertEquals("Neues Rezept", result.getName());
        assertEquals("https://s3.bucket.url/image.jpg", result.getBildUrl());

        verify(rezeptMapper, times(1)).rezeptDTOToRezept(rezeptDTO);
        verify(imageUploadService, times(1)).uploadImage(image, 200, 400);
        verify(rezepteRepository, times(1)).save(mappedRezept);
    }

    @Test
    void testDeleteRezept() {
        // Vorbereitung
        int id = 1;
        doNothing().when(rezepteRepository).deleteById(id);

        // Ausführung
        boolean result = rezepteService.deleteRezept(id);

        // Verifikation
        assertTrue(result);
        verify(rezepteRepository, times(1)).deleteById(id);
    }

    @Test
    void testAddTagsToRezept() {
        // Vorbereitung
        int rezeptId = 1;
        Rezept rezept = new Rezept();
        rezept.setId((long) rezeptId);
        rezept.setTags(new ArrayList<>());

        Tag tag1 = new Tag();
        tag1.setId(1L);
        tag1.setLabel("Tag 1");

        Tag tag2 = new Tag();
        tag2.setId(2L);
        tag2.setLabel("Tag 2");

        List<Tag> newTags = Arrays.asList(tag1, tag2);

        when(rezepteRepository.findById(rezeptId)).thenReturn(Optional.of(rezept));
        when(tagService.addTag(tag1)).thenReturn(tag1);
        when(tagService.addTag(tag2)).thenReturn(tag2);

        // Ausführung
        rezepteService.addTagsToRezept(rezeptId, newTags);

        // Verifikation
        assertEquals(2, rezept.getTags().size());
        verify(rezepteRepository, times(1)).save(rezept);
    }

    @Test
    void testUpdateRezept() {
        // Vorbereitung
        Rezept existingRezept = new Rezept();
        existingRezept.setId(1L);
        existingRezept.setName("Old Name");

        Rezept updatedRezept = new Rezept();
        updatedRezept.setId(1L);
        updatedRezept.setName("New Name");

        when(rezepteRepository.findById(1)).thenReturn(Optional.of(existingRezept));
        when(rezepteRepository.save(existingRezept)).thenReturn(updatedRezept);

        // Ausführung
        Optional<Rezept> result = rezepteService.updateRezept(updatedRezept);

        // Verifikation
        assertTrue(result.isPresent());
        assertEquals("New Name", result.get().getName());
        verify(rezepteRepository, times(1)).save(existingRezept);
    }
}
*/
