package com.rezepte_app.handler;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.rezepte_app.model.TagType;

import java.io.IOException;

public class TagTypeDeserializer extends JsonDeserializer<TagType> {
    @Override
    public TagType deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String label = p.getText().trim();  // Entferne unnötige Leerzeichen
        for (TagType type : TagType.values()) {
            if (type.getLabel().equalsIgnoreCase(label)) {
                return type;
            }
        }
        throw new JsonParseException(p, "Unbekannter TagType: " + label);
    }
}
