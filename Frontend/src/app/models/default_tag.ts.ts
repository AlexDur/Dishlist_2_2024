import {Tag} from "./tag";
//TODO: Möglichkeit dem Nutzer geben, eigene Küchen hinzuzufügen

export const DEFAULT_TAGS: Tag[] = [
  { label: 'Vorspeise', count: 0, selected: false, type: 'Gänge' },
  { label: 'Hauptgang', count: 0, selected: false, type: 'Gänge' },
  { label: 'Nachtisch', count: 0, selected: false, type: 'Gänge' },
  { label: 'Chinesisch', count: 0, selected: false, type: 'Küche' },
  { label: 'Deutsch', count: 0, selected: false, type: 'Küche' },
  { label: 'Indisch', count: 0, selected: false, type: 'Küche' },
  { label: 'Italienisch', count: 0, selected: false, type: 'Küche' },
  { label: 'Japanisch', count: 0, selected: false, type: 'Küche' },
  { label: 'Koreanisch', count: 0, selected: false, type: 'Küche' },
  { label: 'Italienisch', count: 0, selected: false, type: 'Küche' },
  { label: 'ballaststoffreich', count: 0, selected: false, type: 'Nährwert' },
  { label: 'kalorienarm', count: 0, selected: false, type: 'Nährwert' },
  { label: 'kalorienreich', count: 0, selected: false, type: 'Nährwert' },
  { label: 'proteinreich', count: 0, selected: false, type: 'Nährwert' },
  { label: 'zuckerarm', count: 0, selected: false, type: 'Nährwert' },
];
