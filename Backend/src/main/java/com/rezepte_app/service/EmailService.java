/*
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(User user, String token) {
        String recipientAddress = user.getEmail();
        String subject = "Registrierungsbestätigung";
        String confirmationUrl = "http://localhost:8080/api/auth/confirm?token=" + token;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText("Um Ihr Konto zu aktivieren, klicken Sie bitte auf diesen Link: \n" + confirmationUrl);

        mailSender.send(email);
    }
}
*/
