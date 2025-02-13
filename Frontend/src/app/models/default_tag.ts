import { Tag } from "./tag";
import { TagType } from "./tagType";

//TODO: Möglichkeit dem Nutzer geben, eigene Küchen hinzuzufügen

export const DEFAULT_TAGS: Tag[] = [
  { id: 1, label: 'Vorspeise', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 2, label: 'Hauptgang', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 3, label: 'Nachtisch', count: 0, selected: false, type: TagType.MAHLZEIT, disabled: false },
  { id: 4, label: 'Chinesisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 5, label: 'Deutsch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 6, label: 'Indisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 7, label: 'Italienisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 8, label: 'Japanisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 9, label: 'Koreanisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
  { id: 10, label: 'Mexikanisch', count: 0, selected: false, type: TagType.LÄNDERKÜCHE, disabled: false },
/*  { id: 11, label: 'ballaststoffreich', count: 0, selected: false, type: TagType.NÄHRWERT, disabled: false },
  { id: 12, label: 'kalorienarm', count: 0, selected: false, type: TagType.NÄHRWERT, disabled: false },
  { id: 13, label: 'kalorienreich', count: 0, selected: false, type: TagType.NÄHRWERT, disabled: false },
  { id: 14, label: 'proteinreich', count: 0, selected: false, type: TagType.NÄHRWERT, disabled: false },
  { id: 15, label: 'zuckerarm', count: 0, selected: false, type: TagType.NÄHRWERT, disabled: false },*/
];
