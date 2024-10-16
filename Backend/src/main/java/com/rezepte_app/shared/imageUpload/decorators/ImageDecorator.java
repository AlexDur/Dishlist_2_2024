package com.rezepte_app.shared.imageUpload.decorators;

import com.rezepte_app.shared.imageUpload.model_basisklasse.Image;

import java.io.IOException;

public abstract class ImageDecorator extends Image{
    protected Image image; // Das zugrunde liegende Bild

    public ImageDecorator(Image image) {
        super(image.getFileName()); //  Dateinamen des zugrunde liegenden Bildes setzen
        this.image = image;  // Zugrunde liegendes Bild initialisieren
    }

    // Geerbte Methode wird überschriebe und als abstrakte gesetzt. Zum Hochladen des Bildes, die von konkreten Dekoratoren implementiert werden muss
    @Override
    public abstract void upload() throws IOException;
}
