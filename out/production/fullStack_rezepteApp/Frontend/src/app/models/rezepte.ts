export interface Rezept {

  id: number;
  name: string;
  onlineAdresse: string;
  tags?: Array<{id:number, type: string; label: string; selected: boolean; count: number }>;
  image?: File | null;
  bildUrl?: string;

}

