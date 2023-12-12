// RezepteRepository.java
package com.rezepte_app;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RezepteRepository extends JpaRepository<Rezept, Integer> {
    // benutzerdefinierten Abfragemethoden

 /*   List<Rezept> findByTitel(String titel);
    void deleteByTitel(String titel);*/


}
