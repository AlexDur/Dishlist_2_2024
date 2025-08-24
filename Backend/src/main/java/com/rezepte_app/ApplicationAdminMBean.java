package com.rezepte_app;

import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.jmx.export.annotation.ManagedAttribute;

@ManagedResource(objectName = "org.springframework.boot:type=Admin,name=SpringApplication")
public class ApplicationAdminMBean {
    @ManagedAttribute
    public String getStatus() {
        return "Running";
    }
}
