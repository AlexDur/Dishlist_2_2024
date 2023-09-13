package com.rezepte_app;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // JDBC-Verbindungsdaten
        String url = "jdbc:mysql://localhost:3306/rezepte_app"; // Ändern Sie dies entsprechend Ihrer Datenbank-URL
        String user = "alexDur"; // Ändern Sie dies entsprechend Ihrem Datenbank-Benutzernamen
        String password = "dallas"; // Ändern Sie dies entsprechend Ihrem Datenbank-Passwort

        RezepteDAO rezepteDAO = new RezepteDAO();

        // JDBC-Verbindung erstellen
        try {
            Connection connection = DriverManager.getConnection(url, user, password);

            // Verbindung erfolgreich hergestellt
            System.out.println("Verbindung zur Datenbank hergestellt.");

            // Fügen Sie hier Ihren Datenbankzugriffscode hinzu
            List<Rezept> rezepte = rezepteDAO.getAllRezepte(connection);
            for (Rezept rezept : rezepte) {
                System.out.println("Name: " + rezept.getName());
                System.out.println("Beschreibung: " + rezept.getBeschreibung());
            }
            // Schließen Sie die Verbindung, wenn Sie fertig sind
            connection.close();
        } catch (SQLException e) {
            // Fehler beim Herstellen der Verbindung
            e.printStackTrace();
        }
    }
}
