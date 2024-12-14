package com.rezepte_app.repository;

import com.rezepte_app.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("SELECT t FROM Tag t WHERE t.label = :label AND t.id = :id")
    Optional<Tag> findByLabelAndId(String label, Long id);
}
