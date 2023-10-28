// RezepteRepository.java
package com.rezepte_app;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RezepteRepository extends JpaRepository<Rezept, Integer> {
    // Ihre benutzerdefinierten Abfragemethoden könnten hier stehen
}
