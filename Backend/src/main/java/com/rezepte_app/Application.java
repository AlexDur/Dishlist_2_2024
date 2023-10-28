import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Diese Annotation kennzeichnet die Klasse als Spring Boot-Anwendung
public class Application {
    public static void main(String[] args) {
        // Diese Methode startet den Spring-Anwendungskontext
        SpringApplication.run(Application.class, args);
    }
}
