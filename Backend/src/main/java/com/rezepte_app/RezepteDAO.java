package com.rezepte_app;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class RezepteDAO {
    // Hier kommen die Methoden für Datenbankoperationen

    // Methode zum Abrufen aller Rezepte aus der Datenbank
    public List<Rezept> getAllRezepte(Connection connection) {
        List<Rezept> rezepte = new ArrayList<>();
        String selectQuery = "SELECT * FROM rezepte";
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(selectQuery)) {
            while (resultSet.next()) {
                // Verarbeiten Sie die abgerufenen Daten und erstellen Sie Rezept-Objekte
                Rezept rezept = new Rezept();
                rezept.setId(resultSet.getInt("id"));
                rezept.setName(resultSet.getString("name"));
                rezept.setBeschreibung(resultSet.getString("beschreibung"));
                // Fügen Sie das Rezept zur Liste hinzu
                rezepte.add(rezept);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rezepte;
    }

    // Weitere Methoden zum Einfügen, Aktualisieren und Löschen von Rezepten
}
