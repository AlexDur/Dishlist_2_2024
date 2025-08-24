package com.rezepte_app.S3;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/*
* Konfig und Bereitstellung des S3-Clients
* Erstellt e. Instanz von S3Client als SpringBean, sodass überall in App per DI verwendbar
* */
@Configuration
public class S3Config {

    private final S3Properties s3Properties;

    public S3Config(S3Properties s3Properties) {
        this.s3Properties = s3Properties;
    }

    /**
     * Hier Bean-Erstellung
     * @return
     */
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(s3Properties.getRegion()))
                .build();
    }

    public String getBucketRegion() {
        return s3Properties.getRegion();
    }
}
