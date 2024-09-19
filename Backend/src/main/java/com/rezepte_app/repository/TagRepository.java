package com.rezepte_app.repository;

import com.rezepte_app.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {

    Optional<Tag> findByLabelAndId(String label, int id);
}
