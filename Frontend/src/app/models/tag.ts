import {Dish} from "../rezepteliste/tags/tags.component";

export interface Tag {
  id?:number;
  label?: Dish;
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'default';
}
