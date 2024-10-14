import {Tag} from "./tag";

export interface Rezept {

  id: number;
  name?: string;
  onlineAdresse?: string;
  person?: string;
  status?: boolean;
  bewertung?: number;
  tags?: Tag[];
  showDeleteButton?: boolean;
  bildUrl?: string;
  image?: File | null;
}

