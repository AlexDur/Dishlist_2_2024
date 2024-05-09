import {Dish} from "../listen-container/rezepteliste/rezepteliste-desktop/tags/tags.component";

export interface Tag {
  id?:number;
  label?: Dish;
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'default';
}
