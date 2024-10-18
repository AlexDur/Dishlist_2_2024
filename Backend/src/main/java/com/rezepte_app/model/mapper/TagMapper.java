package com.rezepte_app.model.mapper;

import com.rezepte_app.dto.TagDTO;
import com.rezepte_app.model.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    TagDTO tagToTagDTO(Tag tag);
    Tag tagDTOToTag(TagDTO tagDTO);
}
