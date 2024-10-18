package com.rezepte_app.model.mapper;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = TagMapper.class)   // Verwendet den TagMapper für die Konvertierung der Tags
public interface RezeptMapper {
    RezeptMapper INSTANCE = Mappers.getMapper(RezeptMapper.class);

    RezeptDTO rezeptToRezeptDTO(Rezept rezept);

    Rezept rezeptDTOToRezept(RezeptDTO rezeptDTO);
}
