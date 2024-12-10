import {Tag} from "./tag";
//TODO: Möglichkeit dem Nutzer geben, eigene Küchen hinzuzufügen

export const DEFAULT_TAGS: Tag[] = [
  { id: 1, label: 'Vorspeise', count: 0, selected: false, type: 'Gänge' },
  { id: 2, label: 'Hauptgang', count: 0, selected: false, type: 'Gänge' },
  { id: 3, label: 'Nachtisch', count: 0, selected: false, type: 'Gänge' },
  { id: 4, label: 'Chinesisch', count: 0, selected: false, type: 'Küche' },
  { id: 5, label: 'Deutsch', count: 0, selected: false, type: 'Küche' },
  { id: 6, label: 'Indisch', count: 0, selected: false, type: 'Küche' },
  { id: 7, label: 'Italienisch', count: 0, selected: false, type: 'Küche' },
  { id: 8, label: 'Japanisch', count: 0, selected: false, type: 'Küche' },
  { id: 9, label: 'Koreanisch', count: 0, selected: false, type: 'Küche' },
  { id: 10, label: 'Mexikanisch', count: 0, selected: false, type: 'Küche' },
  { id: 11, label: 'ballaststoffreich', count: 0, selected: false, type: 'Nährwert' },
  { id: 12, label: 'kalorienarm', count: 0, selected: false, type: 'Nährwert' },
  { id: 13, label: 'kalorienreich', count: 0, selected: false, type: 'Nährwert' },
  { id: 14, label: 'proteinreich', count: 0, selected: false, type: 'Nährwert' },
  { id: 15, label: 'zuckerarm', count: 0, selected: false, type: 'Nährwert' },
];
