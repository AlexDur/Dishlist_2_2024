# Basis-Image
FROM openjdk:11-jre-slim

# Arbeitsverzeichnis im Container setzen
WORKDIR /app

# Anwendungsdatei ins Arbeitsverzeichnis kopieren
COPY target/Backend-1.0-SNAPSHOT.jar app.jar

# Befehl zum Starten der Anwendung
ENTRYPOINT ["java", "-jar", "app.jar"]
