package com.rezepte_app.S3;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/*
* Lädt Konfigurationswerte für Amazon S3 aus app.properties
* */
@Component
//Bindet Konfigurationsdaten aus einer Properties-Datei und macht diese als Java-Objekte verfügbar
@ConfigurationProperties(prefix = "aws.s3")
public class S3Properties {
    private String bucketName;
    private String region;

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getBucketName() {
        return bucketName;
    }
    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }
}
