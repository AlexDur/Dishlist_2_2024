package com.rezepte_app.service;

import com.rezepte_app.model.User;
import com.rezepte_app.model.VerificationToken;
import com.rezepte_app.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;

    @Autowired
    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public VerificationToken createVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, user, LocalDateTime.now().plusDays(1));
        return verificationTokenRepository.save(verificationToken);
    }

    public VerificationToken getVerificationToken(String token) {
        return verificationTokenRepository.findByToken(token).orElse(null);
    }
}
