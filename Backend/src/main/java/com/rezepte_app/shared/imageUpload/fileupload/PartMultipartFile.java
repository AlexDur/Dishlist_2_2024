package com.rezepte_app.shared.imageUpload.fileupload;


import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class PartMultipartFile implements MultipartFile {

    private final Part part;

    public PartMultipartFile(Part part) {
        this.part = part;
    }

    @Override
    public String getName() {
        return part.getName();
    }

    @Override
    public String getOriginalFilename() {
        return part.getSubmittedFileName();
    }

    @Override
    public String getContentType() {
        return part.getContentType();
    }

    @Override
    public boolean isEmpty() {
        return part.getSize() == 0;
    }

    @Override
    public long getSize() {
        return part.getSize();
    }

    @Override
    public byte[] getBytes() throws IOException {
        return part.getInputStream().readAllBytes();
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return part.getInputStream();
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        part.write(dest.getAbsolutePath());
    }
}