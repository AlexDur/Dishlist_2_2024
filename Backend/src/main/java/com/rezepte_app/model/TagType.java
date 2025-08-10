package com.rezepte_app.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.rezepte_app.handler.TagTypeDeserializer;

@JsonDeserialize(using = TagTypeDeserializer.class)
public enum TagType {
    MAHLZEIT("Mahlzeit"),
    LANDESKUECHE("Landesküche"),
    ERNAEHRUNGSWEISE("Ernährungsweise");


    private final String label;

    TagType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static TagType fromLabel(String label) {
        for (TagType type : values()) {
            if (type.label.equalsIgnoreCase(label)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unbekannter TagType: " + label);
    }

}
