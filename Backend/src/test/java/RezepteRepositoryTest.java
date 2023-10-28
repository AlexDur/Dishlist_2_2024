/*
package com.rezepte_app;

import com.rezepte_app.Rezept;
import com.rezepte_app.RezepteRepository;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;


@DataJpaTest
public class RezepteRepositoryTest {
    @Autowired
    private RezepteRepository rezepteRepository;

    @Test
    public void testSaveAndFind() {
        Rezept rezept = new Rezept();
        rezept.setName("Test-Rezept");
        rezepteRepository.save(rezept);

        Optional<Rezept> found = rezepteRepository.findById(rezept.getId());
        assertTrue(found.isPresent());
        assertEquals("Test-Rezept", found.get().getName());
    }
}
*/
