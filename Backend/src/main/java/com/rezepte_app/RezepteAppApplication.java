package com.rezepte_app;

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.regions.Region;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import software.amazon.awssdk.regions.Region;

@SpringBootApplication
public class RezepteAppApplication {
    public static void main(String[] args) {
        // SB startet automatisch mit den Umgebungsvariablen des Betriebssystems
        SpringApplication.run(RezepteAppApplication.class, args);
    }
    @Bean
    public CognitoIdentityProviderClient cognitoIdentityProviderClient() {
        return CognitoIdentityProviderClient.builder()
                .region(Region.EU_CENTRAL_1)
                .build();
    }
}
