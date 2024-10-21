// src/app/models/rezeptAntwort.model.ts
import {Tag} from "./tag";

export interface RezeptAntwort {
  id: number;
  name: string;
  onlineAdresse: string;
  tags?: Tag[];
  bildUrl?: string;
}
