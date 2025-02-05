package com.rezepte_app.repository;

import com.rezepte_app.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Optional<Tag> findByLabel(@Param("label") String label);

    Optional<Tag> findByIdAndLabel(@Param("id") Long id, @Param("label") String label);

}
