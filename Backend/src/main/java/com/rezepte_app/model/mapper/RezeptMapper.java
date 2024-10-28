package com.rezepte_app.model.mapper;

import com.rezepte_app.dto.RezeptDTO;
import com.rezepte_app.model.Rezept;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")   // Verwendet den TagMapper für die Konvertierung der Tags
public interface RezeptMapper {
  /*  RezeptMapper INSTANCE = Mappers.getMapper(RezeptMapper.class);*/

  //Mapstruct kümmert sich um das Mapping zwischen DTO und Modell

    Rezept rezeptDTOToRezept(RezeptDTO rezeptDTO);

 /*   RezeptDTO rezeptToRezeptDTO(Rezept rezept);*/
}
