import {Tag} from "../tag";

export interface RezeptDTO {
  id?: number;
  name: string;
  onlineAdresse: string;
  tags?: Tag[];
  image?: File | null;
  bildUrl?: string;
}
