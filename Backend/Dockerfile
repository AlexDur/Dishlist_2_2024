# --- Build Phase für das Java-Backend ---
# Verwende ein JDK-Image, um das Java-Backend zu bauen
FROM openjdk:17-jdk-slim AS backend-build

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Installiere dos2unix, um Windows-Zeilenumbrüche zu Unix-Zeilenumbrüchen zu konvertieren
RUN apt-get update && apt-get install -y dos2unix

# Kopiere die Maven-Wrapper-Skripte und die pom.xml in das Arbeitsverzeichnis
COPY mvnw . 
COPY .mvn .mvn
COPY pom.xml .

# Debugging: Zeige den Inhalt des Verzeichnisses an
RUN ls -la

# Stelle sicher, dass der Maven Wrapper ausführbar ist (wichtig bei Windows/Linux-Unterschieden)
RUN chmod +x mvnw && dos2unix mvnw

# Lasse Maven die Abhängigkeiten auflösen und cachen
RUN ./mvnw dependency:go-offline

# Kopiere den Quellcode in das Arbeitsverzeichnis
COPY src ./src

# Baue die Anwendung (Spring Boot)
RUN ./mvnw package -DskipTests

# --- Finales Image für das Deployment ---
# Verwende ein schlankes OpenJDK-Image zum Ausführen der Anwendung
FROM openjdk:17-jdk-slim

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere das gebaute JAR des Backends aus der vorherigen Build-Phase
COPY --from=backend-build /app/target/Backend-1.0-SNAPSHOT.jar /app/Backend-1.0-SNAPSHOT.jar

# Kopiere die statischen Dateien aus dem Verzeichnis src/main/resources/static des Backend
COPY --from=backend-build /app/src/main/resources/static /app/static

# Setze den Port, auf dem die Anwendung läuft
ENV PORT 8080
EXPOSE 8080

# Befehl zum Starten der Spring Boot-Anwendung
CMD ["java", "-jar", "Backend-1.0-SNAPSHOT.jar"]
