package com.rezepte_app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RezepteAppApplication {
    public static void main(String[] args) {
        // Prüfen, ob eine Umgebungsvariable `ENV` gesetzt ist
        String env = System.getenv("ENV");
        Dotenv dotenv;

        if (env != null && env.equals("production")) {
            // In der Produktionsumgebung: .env-Datei laden
            dotenv = Dotenv.configure()
                    .directory("C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/fullStack_rezepteApp/Backend")  // Pfad zum backend-Ordner
                    .filename(".env.prod")
                    .load();
        } else {
            // In der lokalen Entwicklungsumgebung: .env.local-Datei laden
            dotenv = Dotenv.configure()
                    .directory("C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/fullStack_rezepteApp/Backend")  // Pfad zum backend-Ordner
                    .filename(".env.local")
                    .load();
        }

        // Umgebungsvariablen setzen
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(RezepteAppApplication.class, args);
    }
}
