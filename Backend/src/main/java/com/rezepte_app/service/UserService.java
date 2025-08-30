package com.rezepte_app.service;

import com.rezepte_app.model.User;
import com.rezepte_app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Save a new user from Cognito to the database
     * @param cognitoUserId The UUID from Cognito
     * @return The saved user entity
     */
    @Transactional
    public User saveUserFromCognito(String cognitoUserId) {
        try {
            // Check if user already exists
            if (userRepository.existsById(cognitoUserId)) {
                logger.info("User with ID {} already exists in database", cognitoUserId);
                return userRepository.findById(cognitoUserId).orElse(null);
            }

            // Create new user
            User newUser = new User(cognitoUserId, LocalDateTime.now());

            User savedUser = userRepository.save(newUser);
            logger.info("Successfully saved new user with ID: {}", cognitoUserId);
            return savedUser;

        } catch (Exception e) {
            logger.error("Error saving user with ID {} to database: {}", cognitoUserId, e.getMessage(), e);
            throw new RuntimeException("Failed to save user to database", e);
        }
    }

    /**
     * Find a user by their Cognito ID
     * @param cognitoUserId The UUID from Cognito
     * @return Optional containing the user if found
     */
    public Optional<User> findUserById(String cognitoUserId) {
        return userRepository.findById(cognitoUserId);
    }

    /**
     * Check if a user exists in the database
     * @param cognitoUserId The UUID from Cognito
     * @return true if user exists, false otherwise
     */
    public boolean userExists(String cognitoUserId) {
        return userRepository.existsById(cognitoUserId);
    }
}
