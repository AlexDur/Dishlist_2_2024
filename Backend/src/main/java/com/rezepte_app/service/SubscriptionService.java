package com.rezepte_app.service;

import com.rezepte_app.model.User;
import com.rezepte_app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;




@Service
public class SubscriptionService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionService.class);


    @Autowired
    private UserRepository userRepository;

    public LocalDateTime calculateTrialEndDate(LocalDateTime subscriptionStartDate) {
        return subscriptionStartDate.plus(7, ChronoUnit.DAYS);
    }

    @Transactional
    public void saveTrialStartDate(String userId, LocalDateTime startDate) {
        logger.info("Speichere Trial-Startdatum für Benutzer: {}", userId);
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setTrialStartDate(startDate);
            userRepository.save(user);
            logger.info("Trial-Startdatum erfolgreich gespeichert: {}", startDate);
        } else {
            logger.warn("Benutzer nicht gefunden: {}", userId);
        }
    }


    public LocalDateTime getTrialStartDate(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            logger.warn("User mit ID {} nicht gefunden", userId);
            return null;
        }
        return userOptional.get().getTrialStartDate();
    }

    // gibt false zurück, wenn localTime nach endDate liegt
    public boolean isTrialExpired(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            LocalDateTime startDate = userOptional.get().getTrialStartDate();
            if (startDate != null) {
                LocalDateTime endDate = calculateTrialEndDate(startDate);
                return LocalDateTime.now().isAfter(endDate);
            }
        }
        return false;
    }

}
