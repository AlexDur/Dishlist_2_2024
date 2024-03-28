export interface Rezept {

  id?: number;
  name?: string;
  onlineAdresse?: string;
  datum?: Date | undefined;
  person?: string;
  status?: boolean;
  bewertung?: number;
  tags?: string[];
  istGeaendert?: boolean;
  showDeleteButton?: boolean;
}

