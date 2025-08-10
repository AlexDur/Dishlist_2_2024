package com.rezepte_app.handler;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.rezepte_app.model.TagType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TagTypeConverter implements AttributeConverter<TagType, String> {

    @Override
    public String convertToDatabaseColumn(TagType attribute) {
        return attribute != null ? attribute.getLabel() : null;
    }

    @Override
    public TagType convertToEntityAttribute(String dbData) {
        return dbData != null ? TagType.fromLabel(dbData) : null;
    }
}
