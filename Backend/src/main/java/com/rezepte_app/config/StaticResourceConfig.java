package com.rezepte_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        // Für Bilder im lokalen Verzeichnis
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/C:/Users/alexd/Softwareentwicklung/Webentwicklung/Fullstack/Angular_Java_rezepteApp/fullStack_rezepteApp/Rezeptbilder/");
    }
}



