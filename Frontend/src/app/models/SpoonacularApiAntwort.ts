export interface SpoonacularApiAntwort {
  id: number;
  title: string;
  image: string;
  sourceUrl: string;
  dishTypes: any[];
  cuisines: string[];
}

export interface SpoonacularApiAntwortGesamt {
  results: SpoonacularApiAntwort[];
  offset: number;
  number: number;
  totalResults: number;
}
