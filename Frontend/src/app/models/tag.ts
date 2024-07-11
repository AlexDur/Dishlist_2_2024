export interface Tag {
  selected: boolean;
  id?:number;
  label?: 'Vorspeise' | 'Hauptgang' | 'Nachtisch';
  count: number;
}
