package com.rezepte_app.repository;

import com.rezepte_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    /**
     * Find a user by their Cognito ID
     * @param id The Cognito user ID
     * @return Optional containing the user if found
     */
    Optional<User> findById(String id);
    
    /**
     * Check if a user exists by their Cognito ID
     * @param id The Cognito user ID
     * @return true if user exists, false otherwise
     */
    boolean existsById(String id);
}
