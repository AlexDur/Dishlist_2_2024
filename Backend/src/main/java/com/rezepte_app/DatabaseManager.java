package com.rezepte_app;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseManager {

    public static void main(String[] args) {
        try {

            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/yourDB");

            // Verbindung holen
            try (Connection connection = ds.getConnection()) {

            } catch (SQLException e) {
                // Fehlerbehandlung
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
