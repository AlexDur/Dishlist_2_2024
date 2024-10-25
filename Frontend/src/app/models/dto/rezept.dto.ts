import {Tag} from "../tag";

export interface RezeptDTO {
  name: string;
  onlineAdresse: string;
  tags: Tag[];
  image?: File | null;
  bildUrl?: string;
}
