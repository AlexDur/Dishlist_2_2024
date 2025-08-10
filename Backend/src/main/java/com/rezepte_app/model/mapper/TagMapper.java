package com.rezepte_app.model.mapper;

import com.rezepte_app.dto.TagDTO;
import com.rezepte_app.model.Tag;
import com.rezepte_app.model.TagType;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public TagDTO convertToTagDTO(Tag tag) {
        TagDTO tagDTO = new TagDTO();
        tagDTO.setId(tag.getId());
        tagDTO.setType(tag.getType());
        tagDTO.setLabel(tag.getLabel());
        tagDTO.setSelected(tag.isSelected());
        tagDTO.setCount(tag.getCount());
        return tagDTO;
    }

    public Tag convertToTag(TagDTO tagDTO) {
        Tag tag = new Tag();
        tag.setId(tagDTO.getId());
        tag.setLabel(tagDTO.getLabel());
        // Hier wird der String, der den TagType beschreibt, in den TagType Enum umgewandelt
        tag.setType(TagType.valueOf(tagDTO.getType()));  // Hier wird der String in TagType umgewandelt
        tag.setSelected(tagDTO.isSelected());
        tag.setCount(tagDTO.getCount());
        return tag;
    }


}
