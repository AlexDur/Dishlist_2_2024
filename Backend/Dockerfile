# Verwende ein offizielles JDK-Image als Basis
FROM openjdk:17-jdk-slim

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Maven-Wrapper-Skripte und die pom.xml in das Arbeitsverzeichnis
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Lasse Maven die Abhängigkeiten auflösen und cachen
RUN ./mvnw dependency:go-offline

# Kopiere den Quellcode in das Arbeitsverzeichnis
COPY src ./src

# Baue die Anwendung
RUN ./mvnw package -DskipTests

# Setze den Port (Heroku verwendet die Umgebungsvariable PORT)
ENV PORT 8080
EXPOSE 8080

# Setze den Befehl, um das JAR-File auszuführen
CMD ["java", "-jar", "target/Backend-1.0-SNAPSHOT.jar"]
