/*
//Servlet-Klasse wird automatisch von der Servlet-Engine (Tomcat,..) aufgerufen.
//Geschieht durch @WebServlet

package com.rezepte_app.controller;

import com.rezepte_app.shared.imageUpload.fileupload.PartMultipartFile;
import com.rezepte_app.shared.imageUpload.services.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;

@WebServlet("/upload")
@MultipartConfig(
        maxFileSize = 20971520, // 20 MB
        maxRequestSize = 20971520, // 20 MB
        fileSizeThreshold = 1048576 // 1 MB
)
public class UploadServlet extends HttpServlet {

    @Autowired
    private ImageUploadService imageUploadService;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // Überprüfen, ob eine Datei hochgeladen wurde
        Part filePart = request.getPart("file"); // "file" ist der Name des Upload-Felds im HTML-Formular

        if (filePart != null && filePart.getSize() > 0) {
            MultipartFile multipartFile = new PartMultipartFile(filePart);

            // Breite und Höhe können aus den Request-Parametern gelesen oder hartcodiert werden
            int width = 400;
            int height = 300;

            // Methode `uploadImage` aufrufen, statt `saveImage`
            String imagePath = imageUploadService.uploadImage(multipartFile, width, height);

            // Erfolgreiche Antwort zurücksenden
            response.getWriter().write("Datei erfolgreich hochgeladen: " + multipartFile.getOriginalFilename());
        } else {
            // Fehlermeldung zurücksenden
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Keine Datei hochgeladen.");
        }
    }
}*/
