package com.rezepte_app;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByLabel(String label);

    List<Tag> findBySeverity(String severity);

    Optional<Tag> findByLabelAndSeverity(String label, String severity);

}
