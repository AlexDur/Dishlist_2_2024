package com.rezepte_app;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RezepteAppApplication {
    public static void main(String[] args) {
        // SB startet automatisch mit den Umgebungsvariablen des Betriebssystems
        SpringApplication.run(RezepteAppApplication.class, args);
    }
}
