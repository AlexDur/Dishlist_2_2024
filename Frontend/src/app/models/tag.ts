export interface Tag {
  id?:number;
  label?: string;
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'default';
}
