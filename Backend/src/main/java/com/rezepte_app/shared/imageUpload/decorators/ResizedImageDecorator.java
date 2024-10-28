/*
package com.rezepte_app.shared.imageUpload.decorators;

import com.rezepte_app.shared.imageUpload.model_basisklasse.Image;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ResizedImageDecorator extends ImageDecorator {
    private int width;
    private int height;

    */
/*super(image) ruft Konstruktor der Oberklasse auf, um image zu übergeben*//*

    public ResizedImageDecorator(Image image, int width, int height) {
        super(image);
        this.width = width;
        this.height = height;
    }

    public void resize() throws IOException {

        BufferedImage originalImage = ImageIO.read(new File(getFileName())); // Bilddatei einlesen
        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, width, height, null); // Bild skalieren
        g.dispose();

        // Das skalierte Bild speichern
        String resizedFileName = "resized_" + getFileName(); // Neuen Dateinamen für das skalierte Bild
        ImageIO.write(resizedImage, "jpg", new File(resizedFileName)); // Bild speichern


        System.out.println("Bild auf  " + width + " und Höhe " + height + "skaliert");
    }

    @Override
    public void upload() throws IOException {
        resize();
        image.upload();
    }

}


*/
