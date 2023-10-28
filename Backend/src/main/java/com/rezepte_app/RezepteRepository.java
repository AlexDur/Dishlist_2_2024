/*DAO (Data Access Model) dient dazu Datenbankzugriffcodes zu organisieren, zu abstrahieren und zu isolieren, um eine saubere und wartbare Anwendungsarchitektur zu ermöglichen

1) Trennung der Verantwortlichkeiten: Eine DAO isoliert die Datenbankzugriffslogik von anderen Teilen der Anwendung, wie z.B. der Geschäftslogik oder der Benutzeroberfläche.
2) Abstraktion der Datenbank: Eine DAO bietet eine Abstraktionsebene über der Datenbank, die es ermöglicht, mit Entitäten oder Objekten zu arbeiten, anstatt direkt mit SQL-Anweisungen zu hantieren.
3) Wiederverwendbarkeit: Durch die Verwendung von DAOs können Datenbankzugriffsoperationen an einer zentralen Stelle definiert werden und sind somit wiederverwendbar.
4) Testbarkeit: DAOs erleichtern das Testen, da Datenbankzugriffsoperationen in eigenen Klassen gekapselt sind.*/

package com.rezepte_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RezepteDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RezepteDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

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

    public void createRezept(Rezept rezept) {
    }

    // Weitere Methoden zum Einfügen, Aktualisieren und Löschen von Rezepten
}
