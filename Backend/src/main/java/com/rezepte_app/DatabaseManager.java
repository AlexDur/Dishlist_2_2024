package com.rezepte_app;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseManager {

    public static void main(String[] args) {
        try {
            // Initialisieren Sie den Context
            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/yourDB");

            // Holen Sie sich eine Verbindung
            try (Connection connection = ds.getConnection()) {
                // Hier können Sie SQL-Anfragen ausführen
                // Zum Beispiel:
                // Statement stmt = connection.createStatement();
                // ResultSet rs = stmt.executeQuery("SELECT * FROM yourTable");
            } catch (SQLException e) {
                // Fehlerbehandlung
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
