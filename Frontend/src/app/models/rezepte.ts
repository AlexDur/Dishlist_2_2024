import {Tag} from "./tag";

export interface Rezept {

  id: number;
  name?: string;
  onlineAdresse?: string;
  tags?: Tag[];
  showDeleteButton?: boolean;
  image?: File | null;
}

