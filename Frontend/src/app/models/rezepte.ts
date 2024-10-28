import {Tag} from "./tag";

export interface Rezept {

  id: number;
  name: string;
  onlineAdresse: string;
  tags?: Array<{ type: string; label: string; selected: boolean; count: number }>;
  image?: File | null;
  bildUrl?: string;
}

