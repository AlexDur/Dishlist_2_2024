import {Tag} from "./tag";

export interface Rezept {

  id: number;
  name?: string;
  onlineAdresse?: string;
  datum?: Date | undefined;
  person?: string;
  status?: boolean;
  bewertung?: number;
  tags?: Tag[];
  istGeaendert?: boolean;
  showDeleteButton?: boolean;
}

