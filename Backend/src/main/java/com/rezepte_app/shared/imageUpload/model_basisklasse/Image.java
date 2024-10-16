package com.rezepte_app.shared.imageUpload.model_basisklasse;

import java.io.IOException;

public class Image {

    private String fileName;

    public Image(String fileName) {
        this.fileName = fileName;
    }


    //Um Dateinamen des Bildes außerhalb der Klasse abrufen zu können.
    public String getFileName() {
        return fileName;
    }

    public void upload() throws IOException {
        System.out.println("Bild hochgeladen" + fileName);
    }
}
