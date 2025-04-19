import { Tag } from "./tag";
import { TagType } from "./tagType";

//TODO: Möglichkeit dem Nutzer geben, eigene Küchen hinzuzufügen

export const DEFAULT_TAGS: Tag[] = [
  { id: 1, label: 'Vorspeise', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 2, label: 'Hauptgang', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 3, label: 'Nachtisch', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 4, label: 'Snack', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 5, label: 'chinesisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 6, label: 'deutsch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 7, label: 'indisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 8, label: 'italienisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 9, label: 'japanisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 10, label: 'koreanisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 11, label: 'mexikanisch', count: 0, selected: false, type: TagType.LANDESKUECHE , disabled: false },
  { id: 12, label: 'fleischhaltig', count: 0, selected: false, type: TagType.ERNAEHRUNGSWEISE , disabled: false },
  { id: 13, label: 'fischhaltig', count: 0, selected: false, type: TagType.ERNAEHRUNGSWEISE , disabled: false },
  { id: 14, label: 'vegan', count: 0, selected: false, type: TagType.ERNAEHRUNGSWEISE , disabled: false },
  { id: 15, label: 'vegetarisch', count: 0, selected: false, type: TagType.ERNAEHRUNGSWEISE , disabled: false },
];


