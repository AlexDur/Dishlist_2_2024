export interface Tag {
  id?:number;
  label?: 'Vorspeise' | 'Hauptgang' | 'Nachtisch';
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'default';
  count: number;
  selected: boolean;
}
